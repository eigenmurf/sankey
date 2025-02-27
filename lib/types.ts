export interface SankeyNode {
  id: string;
  nodeColor: string;
  type: 'AVS' | 'Set' | 'Operator';
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  id?: string;
  color?: string;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface SimulationConfig {
  avsCount: number;
  setsPerAvs: number;
  operatorsCount: number;
  operatorConnectionsPerSet: number;
} 