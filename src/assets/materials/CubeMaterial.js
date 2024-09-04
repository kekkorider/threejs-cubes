import { MeshBasicNodeMaterial, uv, Fn, vec3, vec4, positionLocal, uniform, abs, step, sin, remap, timerLocal, attribute } from 'three/tsl'
import { DoubleSide } from 'three'

export const CubeMaterial = new MeshBasicNodeMaterial({
  transparent: true,
  side: DoubleSide
})

export const u_Scale = uniform(0.75)
export const u_Speed = uniform(1)
export const u_Frequency = uniform(1.3)

const a_Scale = attribute('a_Scale')
const a_Position = attribute('a_Position')

const time = timerLocal()

const calculateValue = () => {
  const dist = a_Position.length().mul(u_Frequency)

  return remap(sin(dist.sub(time.mul(u_Speed))), -1, 1, 0.05, 1)
}

CubeMaterial.positionNode = Fn(() => {
  const val = calculateValue()
  return positionLocal.mul(val).mul(a_Scale).mul(u_Scale)
})()

CubeMaterial.colorNode = Fn(() => {
  const centered = abs(uv().mul(2).sub(1))
  const alpha = step(0.9, centered.x).add(step(0.9, centered.y))

  const val = calculateValue()

  return vec4(vec3(val).mul(vec3(uv().x, val, uv().y)), 1)
})()
