import { MeshBasicNodeMaterial, uv, Fn, vec2, vec3, vec4, positionLocal, uniform, abs, step, clamp, sin, remap, timerLocal, attribute, oneMinus, rotate } from 'three/tsl'
import { DoubleSide, AdditiveBlending } from 'three'

export const CubeMaterial = new MeshBasicNodeMaterial({
  transparent: true,
  side: DoubleSide,
  blending: AdditiveBlending,
  depthWrite: false,
})

export const u_Scale = uniform(0.75)
export const u_Speed = uniform(2)
export const u_Frequency = uniform(0.66)
export const u_Thickness = uniform(0.05)

const a_Scale = attribute('a_Scale')
const a_Position = attribute('a_Position')

const time = timerLocal()

const calculateValue = () => {
  const dist = a_Position.length().mul(u_Frequency)

  return remap(sin(dist.sub(time.mul(u_Speed))), -1, 1, 0.05, 1)
}

CubeMaterial.positionNode = Fn(() => {
  const val = calculateValue()

  const scaled = positionLocal.mul(val).mul(a_Scale).mul(u_Scale)
  const rotated = rotate(scaled, vec3(time, 0, time.mul(0.7)))
  // return positionLocal
  return rotated
})()

CubeMaterial.colorNode = Fn(() => {
  const val = calculateValue()

  const edgeThickness = u_Thickness.mul(val)

  const centered = abs(uv().mul(2).sub(1))
  const edge = step(vec2(oneMinus(edgeThickness)), centered)
  const clampedEdge = clamp(edge.x.add(edge.y), 0.0, 1.0)

  const color = vec3(uv().x, val.mul(0.3), uv().y)
  return vec4(vec3(val).mul(color), 1).mul(clampedEdge).mul(val)
})()
