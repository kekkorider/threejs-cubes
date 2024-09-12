<template>
	<canvas
		class="canvas"
		ref="canvasRef"
		:width="windowWidth"
		:height="windowHeight"
	/>
</template>

<script setup>
import { shallowRef, onMounted, nextTick, watch } from 'vue'
import { useWindowSize, useDevicePixelRatio } from '@vueuse/core'
import {
	Scene,
	PerspectiveCamera,
	InstancedMesh,
	BoxGeometry,
	Object3D,
	InstancedBufferAttribute,
} from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { useGSAP } from '@/composables/useGSAP'
import { CubeMaterial } from '@/assets/materials'
import '@/assets/Debug'

const canvasRef = shallowRef(null)
let scene, camera, renderer, mesh, controls

const { width: windowWidth, height: windowHeight } = useWindowSize()
const { pixelRatio: dpr } = useDevicePixelRatio()

const { gsap } = useGSAP()

//
// Lifecycle
//
onMounted(async () => {
	await nextTick()

	createScene()
	createCamera()
	createRenderer()

	createMesh()

	createControls()

	gsap.ticker.add(time => {
		updateScene(time)
		renderer.renderAsync(scene, camera)
	})
})

//
// Watchers
//
watch(dpr, value => {
	renderer.setPixelRatio(value)
})

watch([windowWidth, windowHeight], value => {
	camera.aspect = value[0] / value[1]
	camera.updateProjectionMatrix()

	renderer.setSize(value[0], value[1])
})

//
// Methods
//
function updateScene(time = 0) {
	controls.update()
}

function createScene() {
	scene = new Scene()
}

function createCamera() {
	camera = new PerspectiveCamera(
		75,
		windowWidth.value / windowHeight.value,
		0.1,
		100
	)
	camera.position.set(4, 4, 10)
}

function createRenderer() {
	renderer = new WebGPURenderer({
		canvas: canvasRef.value,
		alpha: true,
		antialias: dpr.value === 1,
	})

	renderer.setClearColor(0x121212, 1)
	renderer.setSize(windowWidth.value, windowHeight.value)
}

function createControls() {
	controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
}

function createMesh() {
	const geometry = new BoxGeometry(0.9, 0.9, 0.9)
	const material = CubeMaterial

	const size = 13
	mesh = new InstancedMesh(geometry, material, Math.pow(size, 3))

	const dummy = new Object3D()

	const a_Scale = new Float32Array(size * size * size)
	const a_Position = new Float32Array(size * size * size * 3)

	let num = 0,
		x,
		y,
		z
	for (let i = 0; i < size; i++) {
		x = i - size * 0.5 + 0.5
		for (let j = 0; j < size; j++) {
			y = j - size * 0.5 + 0.5
			for (let k = 0; k < size; k++) {
				z = k - size * 0.5 + 0.5

				dummy.position.set(x, y, z)
				dummy.updateMatrix()

				mesh.setMatrixAt(i * size * size + j * size + k, dummy.matrix)

				a_Scale[i * size * size + j * size + k] = gsap.utils.random(0.5, 1)

				num += 3
				a_Position[num - 3] = x
				a_Position[num - 2] = y
				a_Position[num - 1] = z
			}
		}
	}

	mesh.geometry.setAttribute(
		'a_Position',
		new InstancedBufferAttribute(a_Position, 3)
	)

	mesh.geometry.setAttribute(
		'a_Scale',
		new InstancedBufferAttribute(a_Scale, 1)
	)
	mesh.instanceMatrix.needsUpdate = true

	scene.add(mesh)
}
</script>

<style scoped>
.canvas {
	height: 100dvh;
	width: 100dvw;
}
</style>
