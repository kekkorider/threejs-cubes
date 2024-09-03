import { Pane } from 'tweakpane'

import { scale } from '@/assets/materials/SampleTSLMaterial'

const pane = new Pane()

pane.addBinding(scale, 'value', { label: 'Mesh scale', min: 0.2, max: 1, step: 0.01 })
