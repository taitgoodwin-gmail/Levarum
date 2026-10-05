/** Approved qualitative answers. These are not numeric hours or estimates. */
export const WORKLOADS = [
  'A little each week',
  'A steady share of my week',
  'Most of my admin time',
  'I am not sure yet',
] as const

export type Workload = typeof WORKLOADS[number]
