import { SankeyData, SimulationConfig } from './types';

export function generateSankeyData(config: SimulationConfig): SankeyData {
  const { avsCount, setsPerAvs, operatorsCount, operatorConnectionsPerSet } = config;
  
  const nodes: SankeyData['nodes'] = [];
  const links: SankeyData['links'] = [];
  
  // Generate AVS nodes
  for (let i = 0; i < avsCount; i++) {
    nodes.push({
      id: `avs-${i}`,
      nodeColor: '#4dabf7', // Brighter blue
      type: 'AVS'
    });
  }
  
  // Generate Set nodes
  const totalSets = avsCount * setsPerAvs;
  for (let i = 0; i < totalSets; i++) {
    nodes.push({
      id: `set-${i}`,
      nodeColor: '#69db7c', // Brighter green
      type: 'Set'
    });
  }
  
  // Generate Operator nodes
  for (let i = 0; i < operatorsCount; i++) {
    nodes.push({
      id: `operator-${i}`,
      nodeColor: '#ff6b6b', // Brighter red
      type: 'Operator'
    });
  }
  
  // Generate links from AVS to Sets with unique IDs
  for (let i = 0; i < avsCount; i++) {
    const avsId = `avs-${i}`;
    
    for (let j = 0; j < setsPerAvs; j++) {
      const setIndex = i * setsPerAvs + j;
      const setId = `set-${setIndex}`;
      
      links.push({
        source: avsId,
        target: setId,
        value: 5, // Increased value for better visibility
        id: `link-avs${i}-set${setIndex}`
      });
    }
  }
  
  // Generate links from Sets to Operators with unique IDs
  for (let i = 0; i < totalSets; i++) {
    const setId = `set-${i}`;
    
    // For each set, connect to a random subset of operators
    const availableOperators = Array.from({ length: operatorsCount }, (_, j) => j);
    const shuffledOperators = availableOperators.sort(() => Math.random() - 0.5);
    
    // Take the first N operators based on the config
    const connectionsCount = Math.min(operatorConnectionsPerSet, operatorsCount);
    
    for (let j = 0; j < connectionsCount; j++) {
      const operatorIndex = shuffledOperators[j];
      const operatorId = `operator-${operatorIndex}`;
      
      links.push({
        source: setId,
        target: operatorId,
        value: 3, // Increased value for better visibility
        id: `link-set${i}-op${operatorIndex}`
      });
    }
  }
  
  return { nodes, links };
} 