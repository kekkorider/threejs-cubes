import { Pane } from 'tweakpane'

import { u_Scale, u_Speed, u_Frequency, u_Thickness } from '@/assets/materials/CubeMaterial'

const pane = new Pane()

pane.addBinding(u_Scale, 'value', { label: 'Mesh scale', min: 0.2, max: 1, step: 0.01 })
pane.addBinding(u_Speed, 'value', { label: 'Speed', min: 0, max: 5, step: 0.01 })
pane.addBinding(u_Frequency, 'value', { label: 'Frequency', min: 0.5, max: 2.5, step: 0.01 })
pane.addBinding(u_Thickness, 'value', { label: 'Thickness', min: 0.01, max: 1, step: 0.01 })
