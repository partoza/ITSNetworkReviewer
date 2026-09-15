import { questions } from './questions';
import { cyberSecurityQuestions } from './cyber_security';

export const subjects = [
  {
    id: 'network-security',
    name: 'Network Security',
    description: 'Review access control, network defense, secure protocols, threats, and practical protection strategies.',
    questions,
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Practice core cybersecurity concepts, risk awareness, incident response, and protecting digital systems.',
    questions: cyberSecurityQuestions,
  },
];

export const getSubject = (subjectId) => subjects.find((subject) => subject.id === subjectId);
