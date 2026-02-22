/**
 * Dummy research docs (as if from database) – used by Explore modal, /explore, and /explore/doc/[id].
 * Replace with real API later.
 */
export interface ExploreDoc {
  id: string;
  title: string;
  topic: string;
  abstract: string;
  authors: string[];
  year: string;
}

export const EXPLORE_DOCS: ExploreDoc[] = [
  { id: '1', title: 'Neural Architectures for Decentralized Learning', topic: 'Computer Science', abstract: 'We present novel neural architectures designed for federated and decentralized learning settings, improving communication efficiency and convergence rates across heterogeneous devices.', authors: ['Dr. Jane Smith', 'Prof. Alan Chen'], year: '2023' },
  { id: '2', title: 'Optimizing Transformer Latency for Edge Devices', topic: 'Computer Science', abstract: 'This paper addresses latency optimization of transformer models for deployment on resource-constrained edge devices, with benchmarks on mobile and embedded platforms.', authors: ['Dr. Maria Lopez', 'Dr. James Park'], year: '2023' },
  { id: '3', title: 'Federated Learning in Healthcare', topic: 'Computer Science', abstract: 'A survey and framework for applying federated learning to healthcare data while preserving patient privacy and meeting regulatory requirements.', authors: ['Prof. Sarah Williams', 'Dr. Tom Brown'], year: '2023' },
  { id: '4', title: 'Global Collaboration Networks in 21st Century Physics', topic: 'Physics', abstract: 'Analysis of large-scale collaboration patterns in physics research and their impact on citation networks and discovery rates.', authors: ['Dr. Elena Vance', 'Prof. David Lee'], year: '2023' },
  { id: '5', title: 'Quantum Entanglement Applications', topic: 'Physics', abstract: 'Review of emerging applications of quantum entanglement in communication, sensing, and computing.', authors: ['Prof. Liu Wei', 'Dr. Anna Schmidt'], year: '2023' },
  { id: '6', title: 'Dark Matter Detection Methods', topic: 'Physics', abstract: 'Comparative study of direct and indirect dark matter detection methods and recent experimental results.', authors: ['Dr. Carlos Mendez'], year: '2023' },
  { id: '7', title: 'Ethical Implications of Generative Models in Academia', topic: 'Ethics', abstract: 'We examine ethical challenges posed by the use of generative AI in academic writing, peer review, and assessment.', authors: ['Dr. Rachel Green', 'Prof. Mark Hill'], year: '2023' },
  { id: '8', title: 'Bias in AI Systems', topic: 'Ethics', abstract: 'Framework for measuring and mitigating bias in AI systems used in hiring, lending, and public services.', authors: ['Dr. Priya Patel'], year: '2023' },
  { id: '9', title: 'Research Integrity Guidelines', topic: 'Ethics', abstract: 'Updated guidelines for research integrity and reproducibility in computational and empirical research.', authors: ['Prof. Helen Fox', 'Dr. John Doe'], year: '2023' },
  { id: '10', title: 'Clinical Trial Design for Rare Diseases', topic: 'Medicine', abstract: 'Adaptive trial designs and Bayesian methods for clinical trials in rare diseases with small sample sizes.', authors: ['Dr. Susan Adams'], year: '2023' },
  { id: '11', title: 'Precision Medicine and Genomics', topic: 'Medicine', abstract: 'Integration of genomic data into precision medicine workflows and evidence from recent cohort studies.', authors: ['Prof. Michael Zhang', 'Dr. Lisa Wong'], year: '2023' },
  { id: '12', title: 'Healthcare Data Privacy', topic: 'Medicine', abstract: 'Privacy-preserving techniques for sharing and analyzing healthcare data across institutions.', authors: ['Dr. Emily Davis'], year: '2023' },
];

export function getDocById(id: string): ExploreDoc | undefined {
  return EXPLORE_DOCS.find((d) => d.id === id);
}

export function getDocsByTopic(topic: string): ExploreDoc[] {
  return EXPLORE_DOCS.filter((d) => d.topic === topic);
}

export function getTopics(): string[] {
  return Array.from(new Set(EXPLORE_DOCS.map((d) => d.topic)));
}
