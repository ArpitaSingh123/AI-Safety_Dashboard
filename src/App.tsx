// App.tsx
import React, { useState } from 'react';
import './index.css';

type Incident = {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reported_at: string;
};

const initialIncidents: Incident[] = [
  {
    id: 1,
    title: 'Biased Recommendation Algorithm',
    description: 'Algorithm consistently favored certain demographics...',
    severity: 'Medium',
    reported_at: '2025-03-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'LLM Hallucination in Critical Info',
    description: 'LLM provided incorrect safety procedure information...',
    severity: 'High',
    reported_at: '2025-04-01T14:30:00Z',
  },
  {
    id: 3,
    title: 'Minor Data Leak via Chatbot',
    description: 'Chatbot inadvertently exposed non-sensitive user metadata...',
    severity: 'Low',
    reported_at: '2025-03-20T09:15:00Z',
  },
];

const App: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest'>('Newest');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '', severity: 'Low' });

  const toggleDescription = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    const newIncident: Incident = {
      id: incidents.length + 1,
      ...formData,
      reported_at: new Date().toISOString(),
    } as Incident;
    setIncidents([newIncident, ...incidents]);
    setFormData({ title: '', description: '', severity: 'Low' });
  };

  const filteredIncidents = incidents
    .filter(incident => severityFilter === 'All' || incident.severity === severityFilter)
    .sort((a, b) =>
      sortOrder === 'Newest'
        ? new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
        : new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime()
    );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>AI Safety Incident Dashboard</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Filter by Severity:</label>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as any)}>
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label>Sort by Date:</label>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value as any)}>
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>
      </div>

      {filteredIncidents.map(incident => (
        <div
          key={incident.id}
          className="incident-card"
          data-severity={incident.severity}
        >
          <h3>{incident.title}</h3>
          <p><strong>Severity:</strong> {incident.severity}</p>
          <p><strong>Reported:</strong> {new Date(incident.reported_at).toLocaleString()}</p>
          <button onClick={() => toggleDescription(incident.id)}>
            {expandedIds.includes(incident.id) ? 'Hide Details' : 'View Details'}
          </button>
          {expandedIds.includes(incident.id) && <p>{incident.description}</p>}
        </div>
      ))}

      <h2>Report New Incident</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <select
          name="severity"
          value={formData.severity}
          onChange={handleInputChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
