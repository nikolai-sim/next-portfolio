import { PerspectiveCamera, Sphere, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { IEntity, Tag } from "miniplex";
import { createECS } from "miniplex-react";
import { between, insideSphere } from "randomish";
import { FC } from "react";
import { Object3D, Quaternion, Vector3 } from "three";
import { makeInstanceComponents } from "./lib/Instances";
import {
  calculateCell,
  calculateHashForCell,
  calculateHashForPosition,
  SpatialHash,
  SpatialHashTable,
} from "./lib/spatialHashing";
import { batchedSystem, system } from "./lib/systems";
import { GLTF } from "three-stdlib";

import * as THREE from "three";

type GLTFResult = GLTF & {
  nodes: {
    mesh_Firefly_001: THREE.Mesh;
    mesh_Firefly_002: THREE.Mesh;
  };
  materials: {
    ["mat_Firefly.001"]: THREE.MeshStandardMaterial;
  };
};

type Entity = {
  transform: Object3D;
  boid: Tag;
  friends: Entity[];
  velocity: Vector3;
  spatialHashing: {
    sht: Map<SpatialHash, Entity[]>;
    previousHash?: string;
  };
} & IEntity;

/*
A bunch of our stuff needs some temporary vec3 and quaternion objects to modify so we don't
create hundreds of thousands of new objects every frame.
*/
const tmpvec3 = new Vector3();
const tmpquat = new Quaternion();

const sht: SpatialHashTable<Entity> = new Map();

const ecs = createECS<Entity>();

const Boid = makeInstanceComponents();

const Y = new Vector3(0, 0, -1);

const vector = new THREE.Vector3();
const pos = new THREE.Vector3();

export const Boids = () => (
  <>
    {/* We're calling all our ECS systems from a <Systems /> component, for convenience. */}
    <Systems />

    {/* Our swarm! */}
    <Swarm count={1000} />
    <MouseEntity />
  </>
);

const Swarm = ({ count = 100 }) => {
  return (
    <>
      <Boid.Root
        geometry={new THREE.SphereBufferGeometry()}
        material={new THREE.MeshStandardMaterial()}
        scale={0.5}
      ></Boid.Root>

      <ecs.ManagedEntities tag="boid" initial={count}>
        {(entity) => <BoidEntity entity={entity} />}
      </ecs.ManagedEntities>
    </>
  );
};

// const PointSwarm = ({ count = 100 }) => {
//   const { nodes, materials, animations } = useGLTF(
//     "/glbs/meshs/fireflies_MeshPath.glb"
//   ) as GLTFResult;
//   return (
//     <>
//       <Boid.Root
//         geometry={nodes.mesh_Firefly_002.geometry}
//         material={materials["mat_Firefly.001"]}
//         morphTargetDictionary={nodes.mesh_Firefly_002.morphTargetDictionary}
//         morphTargetInfluences={nodes.mesh_Firefly_002.morphTargetInfluences}
//       ></Boid.Root>

//       <ecs.ManagedEntities tag="boid" initial={count}>
//         {(entity) => <BoidEntity entity={entity} />}
//       </ecs.ManagedEntities>
//     </>
//   );
// };

const BoidEntity: FC<{ entity: Entity }> = ({ entity }) => (
  <Boid.Instance
    ref={(o3d) => initializeBoidTransform(entity, o3d)}
    scale={0.1}
  >
    <ecs.Component
      name="velocity"
      data={new Vector3().randomDirection().multiplyScalar(between(2, 10))}
    />
    <ecs.Component name="friends" data={[]} />
    <ecs.Component name="spatialHashing" data={{ sht }} />
  </Boid.Instance>
);

const MouseEntity = () => (
  <ecs.Entity>
    <ecs.Component name="transform" data={new THREE.Object3D()} />
    {/* <ecs.Component name="friends" data={[]} /> */}
    {/* <ecs.Component name="spatialHashing" data={{ sht }} /> */}
    <ecs.Component name="mousePosition" data={new THREE.Vector3()} />
    {/* <ecs.Component name="three">
      <Sphere />
    </ecs.Component> */}
  </ecs.Entity>
);

const Systems = () => {
  const { mouse, camera } = useThree();
  const config = useControls({
    friendRadius: {
      value: 30,
      min: 0,
      max: 100,
      step: 1,
    },
    alignmentFactor: {
      value: 5,
      min: 0,
      max: 10,
      step: 0.25,
    },
    cohesionFactor: {
      value: 7,
      min: 0,
      max: 10,
      step: 0.25,
    },
    separationFactor: {
      value: 100,
      min: 0,
      max: 100,
      step: 0.25,
    },
    avoidEdgeFactor: {
      value: 3,
      min: 0,
      max: 10,
      step: 0.25,
    },
    maxVelocity: {
      value: 1,
      min: 0,
      max: 100,
      step: 1,
    },
  });

  useFrame((_, dt) => {
    /* Boids */
    spatialHashingSystem();
    findFriendsSystem(config.friendRadius);
    alignmentSystem(dt, config.alignmentFactor);
    cohesionSystem(dt, config.cohesionFactor);
    separationSystem(dt, config.separationFactor);
    avoidEdgeSystem(dt, config.avoidEdgeFactor);

    /* System */
    velocitySystem(dt, config.maxVelocity);
    MousePosSystem(mouse, camera);

    // mouseSystem(dt, config.maxVelocity, mouse, camera);
    // console.log(ecs.world.);
  });

  return null;
};

const initializeBoidTransform = (entity: Entity, o3d: Object3D | null) => {
  if (!o3d) {
    // @ts-ignore
    ecs.world.removeComponent(entity, "transform");
  } else {
    // @ts-ignore
    ecs.world.addComponent(entity, { transform: o3d });
    o3d.position.copy(insideSphere(20) as Vector3);
    o3d.quaternion.random();
  }
};

/*
This job goes through all entities that have a transform and a spatialHashing
component and updates the spatial hash table according to their position.
*/
const spatialHashingSystem = system(
  ecs.world.archetype("spatialHashing", "transform"),
  (entities) => {
    for (const entity of entities) {
      const hash = calculateHashForPosition(entity.transform.position);

      if (entity.spatialHashing.previousHash !== hash) {
        const { sht } = entity.spatialHashing;

        /* Remove entity from previous hash */
        if (entity.spatialHashing.previousHash) {
          const previousList = sht.get(entity.spatialHashing.previousHash)!;
          const pos = previousList.indexOf(entity, 0);
          previousList.splice(pos, 1);
        }

        /* Add entity to sht */
        if (!sht.has(hash)) sht.set(hash, []);
        sht.get(hash)!.push(entity);

        /* Remember new hash */
        entity.spatialHashing.previousHash = hash;
      }
    }
  }
);

/*
For entities that have a velocity, this system will apply the velocity (by adding it to
the entity's position), and also clamp it to not be higher than the specified limit.
*/
const velocitySystem = system(
  ecs.world.archetype("velocity", "transform"),
  (entities, dt: number, limit: number = 10) => {
    for (const { velocity, transform } of entities) {
      /* Clamp velocity */
      velocity.clampLength(0, limit);

      /* Apply velocity to position */
      transform.position.add(tmpvec3.copy(velocity).multiplyScalar(dt));

      /* Rotate entity in the direction of velocity */
      transform.quaternion.slerp(
        tmpquat.setFromUnitVectors(Y, tmpvec3.normalize()),
        0.01
      );
    }
  }
);

const MousePosSystem = system(
  ecs.world.archetype("mousePosition", "three"),
  (entities, mouse, camera) => {
    for (const { mousePosition, three } of entities) {
      vector.set(mouse.x, mouse.y, 0);
      vector.unproject(camera); // -1,1 => -screen width/2,screen width/2
      vector.sub(camera.position).normalize();
      const distance = -camera.position.z / vector.z;
      pos.copy(camera.position).add(vector.multiplyScalar(distance));
      //   console.log(mousePosition);
      mousePosition.copy(pos);
      three.position.copy(pos);
    }
  }
);

const mouseSystem = system(
  ecs.world.archetype("velocity", "transform"),
  (entities, dt: number, limit: number = 300, mouse: any, camera: any) => {
    for (const { velocity, transform } of entities) {
      const attraction = 1;
      tmpvec3.x = pos.x;
      tmpvec3.y = pos.y;
      tmpvec3.z = 0;

      const dv = tmpvec3.clone().sub(transform.position).normalize();
      transform.position.add(tmpvec3.copy(dv).multiplyScalar(dt));
      transform.quaternion.slerp(
        tmpquat.setFromUnitVectors(Y, tmpvec3.normalize()),
        0.01
      );
      //   velocity.x += dv.x * attraction;
      //   velocity.y += dv.y * attraction;
      //   velocity.z += dv.z * attraction;
    }
  }
);

/*
This system goes through all entities and checks if they've gone past the boundaries
of the scene. If they have, it will apply an acceleration to help them move back into
the scene.
*/
const avoidEdgeSystem = system(
  ecs.world.archetype("transform"),
  (entities, dt: number, factor = 1, maxRadius = 20) => {
    for (const { transform, velocity } of entities) {
      if (transform.position.length() > maxRadius) {
        const acceleration = tmpvec3
          .copy(transform.position)
          .multiplyScalar((dt * factor) / -20);

        velocity.add(acceleration);
      }
    }
  }
);

/*
This system will go through all entities and identify its "friends", friends being other
boid entities that are within a specific radius to it. This list of friends is used by
other systems to calculate avoidance/separation/cohesion forces.
*/
const findFriendsSystem = batchedSystem(
  ecs.world.archetype("friends", "transform"),
  100,
  (entities, radius = 30, limit = 50) => {
    const radiusSquared = radius ** 2;
    for (const entity of entities) {
      const { position } = entity.transform;

      /* Find the two corners we're interested in */
      const [ax, ay, az] = calculateCell({
        x: position.x - radius,
        y: position.y - radius,
        z: position.z - radius,
      });

      const [bx, by, bz] = calculateCell({
        x: position.x + radius,
        y: position.y + radius,
        z: position.z + radius,
      });

      /* Use the Spatial Hash Table to assemble a list of potential candidates who might be friends of us. */
      const candidates = [];

      for (let ix = ax; ix <= bx; ix++) {
        for (let iy = ay; iy <= by; iy++) {
          for (let iz = az; iz <= bz; iz++) {
            if (candidates.length >= limit) break;

            const hash = calculateHashForCell([ix, iy, iz]);
            candidates.push(...(sht.get(hash) || []));
          }
        }
      }

      /* Now go through these candidates and check their distance to us. */
      entity.friends = candidates.filter(
        (other) =>
          entity !== other &&
          entity.transform.position.distanceToSquared(
            other.transform.position
          ) < radiusSquared
      );
    }
  }
);

/*
This system goes through each entity's friends and calculates the alignment force
to match up the entity's velocity with its friends' average velocity.
*/
const alignmentSystem = system(
  ecs.world.archetype("friends", "velocity"),
  (entities, dt: number, factor = 1) => {
    for (const { friends, velocity } of entities) {
      if (!friends.length) continue;

      const acceleration = friends
        .reduce((acc, friend) => acc.add(friend.velocity), tmpvec3.setScalar(0))
        .divideScalar(friends.length || 1)
        .normalize()
        .multiplyScalar(dt * factor);

      velocity.add(acceleration);
    }
  }
);

/*
This system goes through each entity's friends and calculates the cohesion force
to move the entity closer to its friends by calculating the center point of their
positions and accelerating the entity towards that.
*/
const cohesionSystem = system(
  ecs.world.archetype("friends", "velocity", "transform"),
  (entities, dt: number, factor = 1) => {
    for (const { friends, velocity, transform } of entities) {
      if (!friends.length) continue;

      const acceleration = friends
        .reduce(
          (acc, friend) => acc.add(friend.transform.position),
          tmpvec3.setScalar(0)
        )
        .divideScalar(friends.length || 1)
        .sub(transform.position)
        .normalize()
        .multiplyScalar(dt * factor);

      velocity.add(acceleration);
    }
  }
);

/*
This system goes through each entity's friends and calculates the separation force
to move the entity _away_ from its friends in order to avoid collisions. It does
this by calculating the average distance to each friend and then inverting that
vector before it is applied as a force.
*/
const separationSystem = system(
  ecs.world.archetype("friends", "velocity", "transform"),
  (entities, dt: number, factor = 1) => {
    for (const { friends, velocity, transform } of entities) {
      if (!friends.length) continue;

      const acceleration = friends
        .reduce(
          (acc, friend) =>
            acc.add(friend.transform.position).sub(transform.position),
          tmpvec3.setScalar(0)
        )
        .divideScalar(friends.length || 1)
        .normalize()
        .multiplyScalar(dt * -factor);

      velocity.add(acceleration);
    }
  }
);
