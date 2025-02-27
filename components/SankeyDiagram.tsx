'use client';

import { ResponsiveSankey } from '@nivo/sankey';
import { SankeyData } from '@/lib/types';
import { useState, useCallback, useMemo } from 'react';

interface SankeyDiagramProps {
  data: SankeyData;
}

// Helper function to make colors brighter
const brightenColor = (hex: string, percent: number): string => {
  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Make brighter
  r = Math.min(255, Math.floor(r * (1 + percent / 100)));
  g = Math.min(255, Math.floor(g * (1 + percent / 100)));
  b = Math.min(255, Math.floor(b * (1 + percent / 100)));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Helper function to add alpha channel to color
const addAlpha = (hex: string, alpha: number): string => {
  // Convert hex to RGB
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  // Return rgba
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function SankeyDiagram({ data }: SankeyDiagramProps) {
  // State to track the currently selected node
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Find all connected nodes when a node is selected
  const connectedNodes = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    
    const connected = new Set<string>([selectedNode]);
    
    // If the selected node is an AVS, find all connected Sets and Operators
    if (selectedNode.startsWith('avs-')) {
      // Find all Sets directly connected to this AVS
      data.links.forEach(link => {
        if (link.source === selectedNode) {
          connected.add(link.target); // Add the Set
          
          // Find all Operators connected to these Sets
          data.links.forEach(innerLink => {
            if (innerLink.source === link.target) {
              connected.add(innerLink.target); // Add the Operator
            }
          });
        }
      });
    }
    // If the selected node is an Operator, find all connected Sets and AVS
    else if (selectedNode.startsWith('operator-')) {
      // Find all Sets directly connected to this Operator
      data.links.forEach(link => {
        if (link.target === selectedNode) {
          connected.add(link.source); // Add the Set
          
          // Find all AVS connected to these Sets
          data.links.forEach(innerLink => {
            if (innerLink.target === link.source) {
              connected.add(innerLink.source); // Add the AVS
            }
          });
        }
      });
    }
    // If the selected node is a Set, find all connected AVS and Operators
    else if (selectedNode.startsWith('set-')) {
      // Find all AVS connected to this Set
      data.links.forEach(link => {
        if (link.target === selectedNode) {
          connected.add(link.source); // Add the AVS
        }
      });
      
      // Find all Operators connected to this Set
      data.links.forEach(link => {
        if (link.source === selectedNode) {
          connected.add(link.target); // Add the Operator
        }
      });
    }
    
    return connected;
  }, [selectedNode, data.links]);

  // Find all connected links when a node is selected
  const connectedLinks = useMemo(() => {
    if (!selectedNode || connectedNodes.size <= 1) return new Set<string>();
    
    const connected = new Set<string>();
    
    data.links.forEach(link => {
      if (
        (connectedNodes.has(link.source) && connectedNodes.has(link.target)) ||
        (link.source === selectedNode || link.target === selectedNode)
      ) {
        if (link.id) {
          connected.add(link.id);
        } else {
          connected.add(`${link.source}-${link.target}`);
        }
      }
    });
    
    return connected;
  }, [selectedNode, connectedNodes, data.links]);

  // Format node labels to show the entity type and add custom link colors
  const formattedData = useMemo(() => {
    return {
      ...data,
      nodes: data.nodes.map(node => {
        const isConnected = !selectedNode || connectedNodes.has(node.id);
        return {
          ...node,
          // Extract the entity type from the id for display
          label: node.id.split('-')[0].toUpperCase(),
          // Adjust opacity based on selection state
          nodeColor: isConnected 
            ? node.nodeColor 
            : addAlpha(node.nodeColor, 0.2)
        };
      }),
      links: data.links.map(link => {
        // Find the source node to get its color
        const sourceNode = data.nodes.find(node => node.id === link.source);
        const linkId = link.id || `${link.source}-${link.target}`;
        const isConnected = !selectedNode || connectedLinks.has(linkId);
        
        return {
          ...link,
          // Make the link color a brighter version of the source node color with some transparency
          color: isConnected
            ? (sourceNode ? addAlpha(brightenColor(sourceNode.nodeColor, 30), 0.85) : 'rgba(255, 255, 255, 0.85)')
            : 'rgba(50, 50, 50, 0.1)' // Very faded for non-connected links
        };
      })
    };
  }, [data, selectedNode, connectedNodes, connectedLinks]);

  // Custom tooltip that explains the functionality
  const customTooltip = useCallback(({ node }: { node: any }) => (
    <div className="p-2">
      <strong>{node.type}: </strong>
      {node.id}
      <div className="mt-1 text-xs">
        Click to see all connected paths
      </div>
    </div>
  ), []);

  // Handle node click
  const handleNodeClick = useCallback((node: any) => {
    if (selectedNode === node.id) {
      // If clicking the same node, clear it
      setSelectedNode(null);
    } else {
      // Otherwise set it as the selected node
      setSelectedNode(node.id);
    }
  }, [selectedNode]);

  return (
    <div className="w-full h-full">
      <ResponsiveSankey
        data={formattedData}
        margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
        align="justify"
        colors={(node) => node.nodeColor}
        nodeOpacity={1}
        nodeHoverOpacity={1}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]],
        }}
        linkOpacity={0.9}
        linkHoverOpacity={1}
        linkContract={0}
        enableLinkGradient={true}
        linkBlendMode="lighten" // Better for dark backgrounds
        animate={true}
        labelPosition="outside"
        labelOrientation="vertical"
        labelPadding={16}
        labelTextColor={{
          from: 'color',
          modifiers: [['brighter', 1]],
        }}
        theme={{
          tooltip: {
            container: {
              background: '#333',
              color: '#fff',
              fontSize: 12,
              borderRadius: 4,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '8px 12px',
            },
          },
          labels: {
            text: {
              fill: '#ffffff',
              fontSize: 12,
              fontWeight: 500,
            },
          },
        }}
        nodeTooltip={customTooltip}
        onClick={handleNodeClick}
      />
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Click on nodes to see complete connection paths highlighted, including indirect connections.</p>
        {selectedNode && (
          <p className="mt-2 font-medium">
            Currently showing connections for: <span className="text-primary">{selectedNode}</span>
            <button 
              className="ml-2 text-xs underline text-muted-foreground hover:text-primary"
              onClick={() => setSelectedNode(null)}
            >
              Clear selection
            </button>
          </p>
        )}
      </div>
    </div>
  );
} 