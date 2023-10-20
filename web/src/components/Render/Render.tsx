import { useRef, useState } from 'react'

import Box from '@mui/material/Box'
import { OrbitControls, Edges } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

function RoughBoard(props) {
  const meshRef = useRef()
  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={props.dimensions} />
      <meshBasicMaterial
        wireframe
        wireframeLinewidth={0.1}
        opacity={0.2}
        transparent
        color={'blue'}
      />
    </mesh>
  )
}

function FinishedBoard(props) {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)

  return (
    <mesh
      {...props}
      ref={meshRef}
      onPointerMove={(e) => {
        e.intersections[0].object.uuid === e.object.uuid
          ? setHover(true)
          : setHover(false)
      }}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={props.dimensions} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      <Edges color="grey" />
    </mesh>
  )
}

const Render = ({ dimensions, finishedBoards }) => {
  const scale = 0.2
  const [roughBoardWidth, roughBoardLength, roughBoardThickness] =
    dimensions.map((dim) => dim * scale)

  return (
    <Box width={'1500px'} height={'500px'}>
      <Canvas>
        <ambientLight />
        <RoughBoard
          position={[0, 0, 0]}
          dimensions={[roughBoardLength, roughBoardWidth, roughBoardThickness]}
        />
        {finishedBoards.map(({ dimensions, origin }, i) => {
          const [x, y, z] = origin.map((coord) => coord * scale)
          const [
            finishedBoardWidth,
            finishedBoardLength,
            finishedBoardThickness,
          ] = dimensions.map((dim) => dim * scale)
          return (
            <FinishedBoard
              key={'finished-' + i}
              position={[
                y - roughBoardLength / 2 + finishedBoardLength / 2,
                x - roughBoardWidth / 2 + finishedBoardWidth / 2,
                z - roughBoardThickness / 2 + finishedBoardThickness / 2,
              ]}
              dimensions={[
                finishedBoardLength,
                finishedBoardWidth,
                finishedBoardThickness,
              ]}
            />
          )
        })}
        <OrbitControls />
      </Canvas>
    </Box>
  )
}

export default Render
