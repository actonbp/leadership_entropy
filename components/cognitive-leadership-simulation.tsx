import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Switch } from '@/components/ui/switch';

const NUM_TEAM_MEMBERS = 4;
const NUM_SUBTASKS = 8;
const KSAO_TYPES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

interface Subtask {
  id: number;
  description: string;
  requiredKsaos: string[];
  completedKsaos: string[];
}

interface PerformanceData {
  turn: number;
  score: number;
  completedBy: number;
  taskDescription: string;
  entropy: number;
}

const TeamKSAOSimulation = () => {
  const [leadershipPerceptions, setLeadershipPerceptions] = useState<number[][]>([]);
  const [ksaos, setKsaos] = useState<string[][]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [completedSubtasks, setCompletedSubtasks] = useState<Subtask[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [selfPerception, setSelfPerception] = useState<number[]>([]);
  const [participationProbability, setParticipationProbability] = useState<number[]>([]);
  const [dominantKsaos, setDominantKsaos] = useState<string[]>([]);
  const [individualPreferences, setIndividualPreferences] = useState<string[][]>([]);
  const [entropy, setEntropy] = useState<number>(0);
  const [sharedLeadership, setSharedLeadership] = useState<boolean>(false);

  useEffect(() => {
    initializeSimulation();
  }, []);

  const initializeSimulation = () => {
    // Initialize leadership perceptions (all equal)
    const perceptions = Array.from({ length: NUM_TEAM_MEMBERS }, () =>
      Array(NUM_TEAM_MEMBERS).fill(5)
    );
    setLeadershipPerceptions(perceptions);

    // Initialize KSAOs (one person has most of the important ones)
    const newKsaos = [
      ['A', 'D', 'E', 'F', 'G'], // Leader
      ['B', 'C', 'F'],
      ['C', 'D', 'H'],
      ['B', 'E', 'H']
    ];
    setKsaos(newKsaos);

    // Initialize dominant KSAOs and individual preferences
    const newDominantKsaos = ['A', 'D', 'E'];
    setDominantKsaos(newDominantKsaos);
    const newIndividualPreferences = [
      [...newDominantKsaos, 'F'],
      [...newDominantKsaos, 'B'],
      [...newDominantKsaos, 'C'],
      [...newDominantKsaos, 'H']
    ];
    setIndividualPreferences(newIndividualPreferences);

    // Initialize subtasks
    const newSubtasks: Subtask[] = [
      { id: 0, description: "Analyze Data", requiredKsaos: ['A', 'B'], completedKsaos: [] },
      { id: 1, description: "Develop Strategy", requiredKsaos: ['A', 'D', 'E'], completedKsaos: [] },
      { id: 2, description: "Implement Solution", requiredKsaos: ['C', 'D', 'F'], completedKsaos: [] },
      { id: 3, description: "Test Results", requiredKsaos: ['B', 'E', 'H'], completedKsaos: [] },
      { id: 4, description: "Present Findings", requiredKsaos: ['A', 'G'], completedKsaos: [] },
      { id: 5, description: "Train Team", requiredKsaos: ['D', 'E', 'F'], completedKsaos: [] },
      { id: 6, description: "Evaluate Performance", requiredKsaos: ['A', 'C', 'H'], completedKsaos: [] },
      { id: 7, description: "Optimize Process", requiredKsaos: ['A', 'D', 'F', 'G'], completedKsaos: [] }
    ];
    setSubtasks(newSubtasks);
    setCompletedSubtasks([]);

    setCurrentTurn(0);
    setPerformance([]);
    setLog(["Simulation started. Member 1 has the majority of important KSAOs, but this is unknown to the team."]);
    setSelfPerception(perceptions.map((row, index) => row[index]));
    setParticipationProbability(Array(NUM_TEAM_MEMBERS).fill(1 / NUM_TEAM_MEMBERS));
    setEntropy(0);
    setSharedLeadership(false);
  };

  const determineAttempter = () => {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (let i = 0; i < NUM_TEAM_MEMBERS; i++) {
      cumulativeProbability += participationProbability[i];
      if (rand <= cumulativeProbability) {
        return i;
      }
    }
    return NUM_TEAM_MEMBERS - 1;
  };

  const updatePerceptions = (attempter: number, completedKsaos: string[], success: boolean) => {
    setLeadershipPerceptions(prev => {
      const newPerceptions = [...prev];
      for (let i = 0; i < NUM_TEAM_MEMBERS; i++) {
        const preferredKsaos = individualPreferences[i];
        const completedPreferredKsaos = completedKsaos.filter(ksao => preferredKsaos.includes(ksao));
        let change = success
          ? (completedPreferredKsaos.length / preferredKsaos.length) + (Math.random() * 0.2 - 0.1)
          : -0.1 + (Math.random() * 0.1 - 0.05);
        
        if (sharedLeadership) {
          // Increase change for non-attempters to promote shared leadership
          if (i !== attempter) {
            change *= 1.5;
          } else {
            change *= 0.5;
          }
        }
        
        newPerceptions[i][attempter] = Math.max(1, Math.min(10, newPerceptions[i][attempter] + change));
      }
      return newPerceptions;
    });

    setSelfPerception(prev => {
      const newSelfPerception = [...prev];
      const change = success
        ? (completedKsaos.length / individualPreferences[attempter].length) + (Math.random() * 0.2 - 0.1)
        : -0.1 + (Math.random() * 0.1 - 0.05);
      newSelfPerception[attempter] = Math.max(1, Math.min(10, newSelfPerception[attempter] + change));
      return newSelfPerception;
    });

    setParticipationProbability(prev => {
      const totalPerception = leadershipPerceptions.reduce((sum, row) => sum + row[attempter], 0);
      const newProbabilities = prev.map((p, i) => 
        i === attempter ? p * (1 + (success ? completedKsaos.length / 10 : -0.05)) : p * (1 - (success ? completedKsaos.length / 20 : -0.025))
      );
      const sum = newProbabilities.reduce((a, b) => a + b, 0);
      return newProbabilities.map(p => p / sum);
    });
  };

  const runSimulationStep = () => {
    const attempter = determineAttempter();
    const incompleteSubtasks = subtasks.filter(task => task.completedKsaos.length < task.requiredKsaos.length);
  
    if (incompleteSubtasks.length === 0) {
      setLog(prev => [...prev, `All subtasks completed in ${currentTurn} turns. Simulation ended.`]);
      return;
    }

    // Sort incomplete subtasks by their ID to maintain a general order
    incompleteSubtasks.sort((a, b) => a.id - b.id);

    // Select the first incomplete subtask, but with a small chance to pick a random one
    const taskIndex = Math.random() < 0.9 ? 0 : Math.floor(Math.random() * incompleteSubtasks.length);
    const task = incompleteSubtasks[taskIndex];

    // Filter out already completed KSAOs
    const remainingKsaos = task.requiredKsaos.filter(ksao => !task.completedKsaos.includes(ksao));
    const completedKsaos = remainingKsaos.filter(ksao => ksaos[attempter].includes(ksao));

    if (completedKsaos.length > 0) {
      const newCompletedKsaos = Array.from(new Set([...task.completedKsaos, ...completedKsaos]));
      setSubtasks(prev => prev.map(t => t.id === task.id ? { ...t, completedKsaos: newCompletedKsaos } : t));
      setLog(prev => [...prev, `Turn ${currentTurn + 1}: Member ${attempter + 1} successfully contributed KSAOs ${completedKsaos.join(', ')} to "${task.description}"`]);
      updatePerceptions(attempter, completedKsaos, true);

      if (newCompletedKsaos.length === task.requiredKsaos.length) {
        setCompletedSubtasks(prev => [...prev, task]);
        setLog(prev => [...prev, `Subtask "${task.description}" fully completed!`]);
      }
    } else {
      setLog(prev => [...prev, `Turn ${currentTurn + 1}: Member ${attempter + 1} failed to contribute to "${task.description}"`]);
      updatePerceptions(attempter, [], false);
    }

    // Calculate performance and entropy
    const newPerformance = {
      turn: currentTurn + 1,
      score: subtasks.reduce((sum, task) => sum + task.completedKsaos.length / task.requiredKsaos.length, 0) / NUM_SUBTASKS,
      completedBy: attempter + 1,
      taskDescription: task.description,
      entropy: calculateEntropy()
    };
    setPerformance(prev => [...prev, newPerformance]);

    setCurrentTurn(prev => prev + 1);
  };

  const getTotalLeadershipPerceptions = () => {
    if (!leadershipPerceptions.length) return [];
    return leadershipPerceptions[0].map((_, colIndex) => ({
      member: `Member ${colIndex + 1}`,
      totalPerception: leadershipPerceptions.reduce((sum, row, rowIndex) =>
        rowIndex !== colIndex ? sum + row[colIndex] : sum, 0) + selfPerception[colIndex]
    }));
  };

  const calculateEntropy = () => {
    const totalPerceptions = getTotalLeadershipPerceptions();
    const totalSum = totalPerceptions.reduce((sum, member) => sum + member.totalPerception, 0);
    const probabilities = totalPerceptions.map(member => member.totalPerception / totalSum);
    
    const entropyValue = -probabilities.reduce((sum, p) => {
      if (p === 0) return sum;
      return sum + p * Math.log2(p);
    }, 0);
    
    setEntropy(entropyValue);
    return entropyValue;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Complex Team KSAO and Mission Completion Simulation</h1>
      
      <div className="mb-6 space-x-4">
        <Button onClick={runSimulationStep} className="bg-primary hover:bg-blue-600">Run Simulation Step</Button>
        <Button onClick={initializeSimulation} className="bg-secondary hover:bg-green-600">Reset Simulation</Button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <span>Shared Leadership:</span>
        <Switch
          checked={sharedLeadership}
          onCheckedChange={setSharedLeadership}
          disabled={currentTurn > 0}
        />
        {currentTurn > 0 && (
          <span className="text-sm text-gray-500">
            (Locked after simulation starts)
          </span>
        )}
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-card">
        <span className="font-semibold text-gray-700">Current Turn:</span> {currentTurn}
        <span className="ml-6 font-semibold text-gray-700">Completed Subtasks:</span> {completedSubtasks.length} / {NUM_SUBTASKS}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="mb-4 bg-white p-2 rounded-lg shadow-sm">
          <TabsTrigger value="performance" className="px-4 py-2 text-sm font-medium">Performance</TabsTrigger>
          <TabsTrigger value="perceptions" className="px-4 py-2 text-sm font-medium">Leadership Perceptions</TabsTrigger>
          <TabsTrigger value="ksaos" className="px-4 py-2 text-sm font-medium">Team KSAOs</TabsTrigger>
          <TabsTrigger value="subtasks" className="px-4 py-2 text-sm font-medium">Subtasks</TabsTrigger>
          <TabsTrigger value="log" className="px-4 py-2 text-sm font-medium">Simulation Log</TabsTrigger>
          <TabsTrigger value="entropy">Entropy</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold mb-4">Team Performance Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="turn" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="score" stroke="#8884d8" name="Performance" />
              <Line yAxisId="right" type="monotone" dataKey="entropy" stroke="#82ca9d" name="Entropy" />
              <ReferenceLine y={Math.log2(NUM_TEAM_MEMBERS)} yAxisId="right" label="Max Entropy" stroke="red" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="perceptions" className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Leadership Perceptions Matrix</h2>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">Team Member</th>
                {Array.from({ length: NUM_TEAM_MEMBERS }, (_, i) => (
                  <th key={i} className="border border-gray-400 p-2">Member {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leadershipPerceptions.map((row, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 p-2">Member {i + 1}</td>
                  {row.map((perception, j) => (
                    <td key={j} className="border border-gray-400 p-2">{perception.toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Total Leadership Perceptions</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getTotalLeadershipPerceptions()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="member" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalPerception" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="ksaos" className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Team KSAOs</h2>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">Team Member</th>
                <th className="border border-gray-400 p-2">KSAOs</th>
              </tr>
            </thead>
            <tbody>
              {ksaos.map((memberKsaos, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 p-2">Member {i + 1}</td>
                  <td className="border border-gray-400 p-2">{memberKsaos.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="subtasks" className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Subtasks and Required KSAOs</h2>
          <div className="space-y-4">
            {subtasks.map((task) => {
              const isCompleted = task.completedKsaos.length === task.requiredKsaos.length;
              return (
                <div key={task.id} className={`p-4 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <h3 className="font-bold text-lg mb-2">{task.description}</h3>
                  <p className="mb-1">Required KSAOs: {task.requiredKsaos.join(', ')}</p>
                  <p className="mb-2">Completed KSAOs: {task.completedKsaos.join(', ') || 'None'}</p>
                  <div className="flex space-x-2">
                    {task.requiredKsaos.map((ksao, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium
                          ${task.completedKsaos.includes(ksao) 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700'}`}
                      >
                        {ksao}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="log" className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Simulation Log</h2>
          <div className="border p-4 h-96 overflow-y-auto">
            {log.map((entry, index) => (
              <div key={index} className="mb-2">{entry}</div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="entropy" className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold mb-4">Leadership Entropy Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="turn" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="score" stroke="#8884d8" name="Performance" />
              <Line yAxisId="right" type="monotone" dataKey="entropy" stroke="#82ca9d" name="Entropy" />
              <ReferenceLine y={Math.log2(NUM_TEAM_MEMBERS)} yAxisId="right" label="Max Entropy" stroke="red" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-4">
            Entropy measures the uncertainty in leadership distribution. Low entropy indicates clear leadership, while high entropy suggests shared or uncertain leadership. The maximum possible entropy is log2({NUM_TEAM_MEMBERS}) ≈ {Math.log2(NUM_TEAM_MEMBERS).toFixed(2)}.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamKSAOSimulation;