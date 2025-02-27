'use client';

import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationConfig } from '@/lib/types';
import { useState } from 'react';

interface ConfigPanelProps {
  config: SimulationConfig;
  onChange: (config: SimulationConfig) => void;
}

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const handleAvsCountChange = (value: number[]) => {
    onChange({ ...config, avsCount: value[0] });
  };

  const handleSetsPerAvsChange = (value: number[]) => {
    onChange({ ...config, setsPerAvs: value[0] });
  };

  const handleOperatorsCountChange = (value: number[]) => {
    onChange({ ...config, operatorsCount: value[0] });
  };

  const handleOperatorConnectionsPerSetChange = (value: number[]) => {
    onChange({ ...config, operatorConnectionsPerSet: value[0] });
  };

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">AVS Count: {config.avsCount}</label>
          </div>
          <Slider
            defaultValue={[config.avsCount]}
            max={10}
            min={1}
            step={1}
            onValueChange={handleAvsCountChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Sets Per AVS: {config.setsPerAvs}</label>
          </div>
          <Slider
            defaultValue={[config.setsPerAvs]}
            max={10}
            min={1}
            step={1}
            onValueChange={handleSetsPerAvsChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Operators Count: {config.operatorsCount}</label>
          </div>
          <Slider
            defaultValue={[config.operatorsCount]}
            max={20}
            min={1}
            step={1}
            onValueChange={handleOperatorsCountChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">
              Operator Connections Per Set: {config.operatorConnectionsPerSet}
            </label>
          </div>
          <Slider
            defaultValue={[config.operatorConnectionsPerSet]}
            max={10}
            min={1}
            step={1}
            onValueChange={handleOperatorConnectionsPerSetChange}
          />
        </div>
      </CardContent>
    </Card>
  );
} 