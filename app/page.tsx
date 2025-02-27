'use client';

import { useState, useEffect } from 'react';
import { SankeyDiagram } from '@/components/SankeyDiagram';
import { ConfigPanel } from '@/components/ConfigPanel';
import { generateSankeyData } from '@/lib/generate-data';
import { SimulationConfig, SankeyData } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [config, setConfig] = useState<SimulationConfig>({
    avsCount: 3,
    setsPerAvs: 2,
    operatorsCount: 5,
    operatorConnectionsPerSet: 2,
  });

  const [data, setData] = useState<SankeyData | null>(null);

  // Generate data on initial load and when config changes
  useEffect(() => {
    const newData = generateSankeyData(config);
    setData(newData);
  }, [config]);

  const handleConfigChange = (newConfig: SimulationConfig) => {
    setConfig(newConfig);
  };

  const handleRegenerateClick = () => {
    const newData = generateSankeyData(config);
    setData(newData);
  };

  if (!data) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col p-8 bg-background text-foreground">
      <div className="container mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">AVS, Sets, and Operators Visualization</h1>
          <p className="text-muted-foreground">
            Visualize the connections between AVS, Sets, and Operators using a Sankey diagram
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ConfigPanel config={config} onChange={handleConfigChange} />
            <div className="mt-4">
              <Button 
                className="w-full" 
                onClick={handleRegenerateClick}
              >
                Regenerate Connections
              </Button>
            </div>
          </div>
          <div className="lg:col-span-3 bg-card rounded-lg p-4 shadow-md h-[600px]">
            <SankeyDiagram data={data} />
          </div>
        </div>

        <div className="mt-8 p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">About This Visualization</h2>
          <div className="space-y-4">
            <p>
              This Sankey diagram visualizes the relationships between three entity types:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold text-[#4dabf7]">AVS (Left)</span>: The source entities.
              </li>
              <li>
                <span className="font-semibold text-[#69db7c]">Sets (Middle)</span>: Intermediate entities that connect AVS to Operators.
              </li>
              <li>
                <span className="font-semibold text-[#ff6b6b]">Operators (Right)</span>: The target entities that can be connected to multiple Sets.
              </li>
            </ul>
            <p>
              Use the configuration panel to adjust the number of entities and their connections.
              The &quot;Regenerate Connections&quot; button will create new random connections while maintaining the same entity counts.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
