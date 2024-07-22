// Import necessary React hooks and UI components
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Switch } from '@/components/ui/switch';

// Constants for simulation parameters
const NUM_TEAM_MEMBERS = 4;
const NUM_SUBTASKS = 8;
const KSAO_TYPES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Interface for a subtask in the simulation
interface Subtask {
  id: number;
  description: string;
  requiredKsaos: string[];  // KSAOs required to complete the subtask
  completedKsaos: string[]; // KSAOs that have been applied to the subtask
}

// Interface for performance data collected during the simulation
interface PerformanceData {
  turn: number;
  score: number;
  completedBy: number;
  taskDescription: string;
  entropy: number; // Measure of leadership distribution
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

    if (sharedLeadership) {
      setParticipationProbability(Array(NUM_TEAM_MEMBERS).fill(1 / NUM_TEAM_MEMBERS));
      setLog(prev => [...prev, "Shared Leadership mode: All team members are equally likely to participate."]);
    } else {
      const initialProbabilities = [0.4, 0.3, 0.2, 0.1]; // Favoring the member with more KSAOs
      setParticipationProbability(initialProbabilities);
      setLog(prev => [...prev, "Traditional Leadership mode: Some members are more likely to lead initially."]);
    }

    setEntropy(calculateEntropy());
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
          // In shared leadership, perceptions change more slowly and are more balanced
          change *= 0.5;
        } else {
          // In traditional leadership, perceptions change faster for the attempter
          if (i === attempter) {
            change *= 1.5;
          }
        }
        
        newPerceptions[i][attempter] = Math.max(1, Math.min(10, newPerceptions[i][attempter] + change));
      }
      return newPerceptions;
    });

    // Update participation probability
    setParticipationProbability(prev => {
      if (sharedLeadership) {
        // In shared leadership, probabilities remain more balanced
        return prev.map(p => 0.9 * p + 0.1 * (1 / NUM_TEAM_MEMBERS));
      } else {
        // In traditional leadership, probabilities change based on performance
        const newProbabilities = prev.map((p, i) => 
          i === attempter ? p * (1 + (success ? 0.1 : -0.05)) : p * (1 - (success ? 0.05 : -0.025))
        );
        const sum = newProbabilities.reduce((a, b) => a + b, 0);
        return newProbabilities.map(p => p / sum);
      }
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
    const taskLeadershipData = subtasks.map(task => {
      const contributor = performance.find(p => p.taskDescription === task.description)?.completedBy;
      if (!contributor) return { ELC: 0, IC: 0, progress: 0 };

      // Calculate External Leadership Clarity (ELC)
      const leadershipScores = leadershipPerceptions.map(row => row[contributor - 1]);
      const ELC = 1 / leadershipScores.reduce((sum, score) => sum + Math.pow(score, 2), 0);

      // Calculate Internal Consensus (IC)
      const mean = leadershipScores.reduce((sum, score) => sum + score, 0) / NUM_TEAM_MEMBERS;
      const variance = leadershipScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / NUM_TEAM_MEMBERS;
      const maxPossibleVariance = Math.pow(10 - 1, 2) / 4; // Assuming scores range from 1 to 10
      const IC = 1 - (variance / maxPossibleVariance);

      // Calculate task progress
      const progress = task.completedKsaos.length / task.requiredKsaos.length;

      return { ELC, IC, progress };
    });

    const overallProgress = subtasks.reduce((sum, task) => sum + task.completedKsaos.length, 0) / 
                            subtasks.reduce((sum, task) => sum + task.requiredKsaos.length, 0);

    const totalProduct = taskLeadershipData.reduce((sum, { ELC, IC, progress }) => sum + ELC * IC * (1 - progress), 0);
    
    let entropyValue = taskLeadershipData.reduce((sum, { ELC, IC, progress }) => {
      const probability = (ELC * IC * (1 - progress)) / totalProduct;
      if (probability === 0) return sum;
      return sum - probability * Math.log2(probability);
    }, 0);

    // Adjust entropy based on overall progress and leadership style
    const progressFactor = 1 - Math.pow(overallProgress, 0.5); // Slower decrease at the beginning
    const leadershipFactor = sharedLeadership ? 0.9 : 0.7; // Shared leadership maintains higher entropy

    entropyValue = entropyValue * progressFactor * leadershipFactor;

    // Normalize entropy to be between 0 and 1
    const normalizedEntropy = entropyValue / Math.log2(NUM_SUBTASKS);
    
    setEntropy(normalizedEntropy);
    return normalizedEntropy;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Complex Team KSAO and Mission Completion Simulation</h1>
      
      <div className="mb-6 p-4 bg-blue-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Choose Leadership Style:</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="shared-leadership"
            checked={sharedLeadership}
            onCheckedChange={setSharedLeadership}
          />
          <label htmlFor="shared-leadership" className="font-medium">
            Shared Leadership
          </label>
        </div>
        <p className="mt-2 text-sm">
          Shared Leadership: A team where leadership is distributed among members. Each person is equally likely to take on leadership roles. These teams may have higher entropy initially but can develop unique strengths over time.
        </p>
        <p className="mt-2 text-sm">
          Traditional Leadership: A team where clear leaders emerge for specific tasks. These teams may have lower entropy and complete tasks faster initially, but may lack flexibility.
        </p>
      </div>

      <div className="mb-6 space-x-4">
        <Button onClick={runSimulationStep} className="bg-primary hover:bg-blue-600">Run Simulation Step</Button>
        <Button onClick={initializeSimulation} className="bg-secondary hover:bg-green-600">Reset Simulation</Button>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-card">
        <span className="font-semibold text-gray-700">Current Turn:</span> {currentTurn}
        <span className="ml-6 font-semibold text-gray-700">Completed Subtasks:</span> {completedSubtasks.length} / {NUM_SUBTASKS}
      </div>

      <Tabs defaultValue="introduction" className="w-full">
        <TabsList className="mb-4 bg-white p-2 rounded-lg shadow-sm">
          <TabsTrigger value="introduction" className="px-4 py-2 text-sm font-medium">Introduction</TabsTrigger>
          <TabsTrigger value="performance" className="px-4 py-2 text-sm font-medium">Performance</TabsTrigger>
          <TabsTrigger value="perceptions" className="px-4 py-2 text-sm font-medium">Leadership Perceptions</TabsTrigger>
          <TabsTrigger value="ksaos" className="px-4 py-2 text-sm font-medium">Team KSAOs</TabsTrigger>
          <TabsTrigger value="subtasks" className="px-4 py-2 text-sm font-medium">Subtasks</TabsTrigger>
          <TabsTrigger value="log" className="px-4 py-2 text-sm font-medium">Simulation Log</TabsTrigger>
          <TabsTrigger value="entropy">Entropy</TabsTrigger>
        </TabsList>

        <TabsContent value="introduction" className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Team Leadership and KSAO Simulation</h2>
          <p className="mb-4">
            This simulation explores the dynamics of team leadership and the impact of Knowledge, Skills, Abilities, and Other characteristics (KSAOs) on team performance and leadership emergence.
          </p>
          <h3 className="text-xl font-semibold mb-2">How it works:</h3>
          <ol className="list-decimal list-inside mb-4">
            <li className="mb-2">The simulation starts with a team of {NUM_TEAM_MEMBERS} members, each with unique KSAOs.</li>
            <li className="mb-2">There are {NUM_SUBTASKS} subtasks to complete, each requiring specific KSAOs.</li>
            <li className="mb-2">In each turn, a team member attempts to contribute to a subtask based on their KSAOs.</li>
            <li className="mb-2">Leadership perceptions change based on successful contributions and team dynamics.</li>
            <li className="mb-2">The simulation tracks performance, leadership perceptions, and leadership entropy over time.</li>
          </ol>
          <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
          <ul className="list-disc list-inside mb-4">
            <li className="mb-2"><strong>Shared Leadership:</strong> Toggle this option to see how it affects team dynamics and performance.</li>
            <li className="mb-2"><strong>Leadership Entropy:</strong> Measures the uncertainty in leadership distribution. Higher entropy indicates more shared or uncertain leadership.</li>
            <li className="mb-2"><strong>Performance:</strong> Tracks the team's progress in completing subtasks over time.</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Understanding Leadership Entropy:</h3>
          <p className="mb-4">
            Leadership Entropy in this simulation measures the effectiveness of shared leadership within the team. Lower entropy indicates more effective leadership, where:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li className="mb-2">There are clear leaders for specific subtasks (high External Leadership Clarity)</li>
            <li className="mb-2">The team agrees on who these leaders are (high Internal Consensus)</li>
            <li className="mb-2">This pattern is consistent across different subtasks</li>
          </ul>
          <p className="mb-4">
            Higher entropy suggests less effective leadership, which can occur when:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li className="mb-2">Leadership is evenly distributed among all team members for subtasks</li>
            <li className="mb-2">There's disagreement about who is leading</li>
            <li className="mb-2">The leadership structure varies widely between subtasks</li>
          </ul>
          <p className="mb-4">
            This approach recognizes that effective shared leadership doesn't mean everyone leads all the time, but rather that leadership is clearly distributed among team members for different subtasks, with strong agreement about these roles.
          </p>
          <p>
            Use the tabs above to explore different aspects of the simulation, and use the "Run Simulation Step" button to progress through the simulation.
          </p>
        </TabsContent>

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
          <p className="mt-4">
            Entropy measures the uncertainty in leadership distribution. In shared leadership teams, entropy tends to remain higher as leadership is more evenly distributed. In traditional leadership teams, entropy typically decreases over time as clear leaders emerge for specific tasks. Lower entropy indicates more defined leadership roles, while higher entropy suggests more distributed leadership.
          </p>
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
            Entropy measures the uncertainty in leadership distribution. In shared leadership teams, entropy tends to remain higher as leadership is more evenly distributed. In traditional leadership teams, entropy typically decreases over time as clear leaders emerge for specific tasks. Lower entropy indicates more defined leadership roles, while higher entropy suggests more distributed leadership.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamKSAOSimulation;
