export const networkingQuestions = [
  {
    id: 'net-001',
    type: 'multiple-choice',
    question: 'A computer successfully pings 127.0.0.1 but cannot ping 192.168.1.1 and has address 169.254.20.15. What is the most likely problem?',
    options: [
      'The computer likely failed to obtain a proper IP configuration from DHCP',
      'The computer has a valid Internet connection',
      'The loopback address is incorrect',
      "The computer's TCP/IP stack is completely disabled"
    ],
    correctAnswer: 'The computer likely failed to obtain a proper IP configuration from DHCP'
  },
  {
    id: 'net-002',
    type: 'multiple-choice',
    question: 'Two computers receive APIPA addresses. What communication is possible?',
    options: [
      'They can automatically access the Internet',
      'They can route traffic across the Internet',
      'They have public IP addresses',
      'They may communicate locally if on the same network'
    ],
    correctAnswer: 'They may communicate locally if on the same network'
  },
  {
    id: 'net-003',
    type: 'multiple-choice',
    question: 'A DHCP server has a pool of 50 addresses but 80 computers need addresses. What may happen?',
    options: [
      'Every computer gets an address',
      'The switch supplies additional addresses',
      'All devices use loopback addresses',
      'Some computers may fail to obtain a DHCP address'
    ],
    correctAnswer: 'Some computers may fail to obtain a DHCP address'
  },
  {
    id: 'net-004',
    type: 'multiple-choice',
    question: 'Which device forwards Ethernet frames based on destination MAC addresses?',
    options: [
      'Router',
      'Repeater',
      'Hub',
      'Switch'
    ],
    correctAnswer: 'Switch'
  },
  {
    id: 'net-005',
    type: 'multiple-choice',
    question: 'What is the name for automatic 169.254.x.x addressing when DHCP fails?',
    options: [
      'Static IP',
      'Loopback',
      'DNS',
      'APIPA'
    ],
    correctAnswer: 'APIPA'
  },
  {
    id: 'net-006',
    type: 'multiple-choice',
    question: 'Which network topology offers high fault tolerance but requires more cabling?',
    options: [
      'Mesh',
      'Bus',
      'Ring',
      'Star'
    ],
    correctAnswer: 'Mesh'
  },
  {
    id: 'net-007',
    type: 'multiple-choice',
    question: 'Which device connects a LAN to other networks or the Internet?',
    options: [
      'Hub',
      'Switch',
      'Repeater',
      'Router'
    ],
    correctAnswer: 'Router'
  },
  {
    id: 'net-008',
    type: 'multiple-choice',
    question: 'A computer receives an APIPA address. What is the likely cause?',
    options: [
      'The DHCP server cannot be reached',
      'The computer has a public IP',
      'The loopback test failed',
      'The gateway assigned a static IP'
    ],
    correctAnswer: 'The DHCP server cannot be reached'
  },
  {
    id: 'net-009',
    type: 'multiple-choice',
    question: 'Which statement correctly distinguishes an intranet and an extranet?',
    options: [
      'Both are always public',
      'An extranet is limited to employees only',
      'An intranet serves internal users; an extranet grants controlled access to external users',
      'Neither requires access controls'
    ],
    correctAnswer: 'An intranet serves internal users; an extranet grants controlled access to external users'
  },
  {
    id: 'net-010',
    type: 'multiple-choice',
    question: 'What can happen if a connection fails in a basic ring topology?',
    options: [
      'Communication may be interrupted',
      'All nodes remain connected through redundant paths',
      'Only the Internet connection is affected',
      'The topology becomes a star'
    ],
    correctAnswer: 'Communication may be interrupted'
  },
  {
    id: 'net-011',
    type: 'multiple-choice',
    question: 'What is a disadvantage of a star topology?',
    options: [
      'Every cable is a shared backbone',
      'The central device can be a single point of failure',
      'It cannot use switches',
      'Adding devices always breaks the network'
    ],
    correctAnswer: 'The central device can be a single point of failure'
  },
  {
    id: 'net-012',
    type: 'multiple-choice',
    question: 'Why is a star topology relatively easy to troubleshoot?',
    options: [
      'Every device shares one cable',
      'Each device has a separate link to the central device',
      'It has no central device',
      'It needs no cabling'
    ],
    correctAnswer: 'Each device has a separate link to the central device'
  },
  {
    id: 'net-013',
    type: 'multiple-choice',
    question: 'Which IP configuration is manually assigned and generally remains fixed?',
    options: [
      'Static IP',
      'Dynamic IP',
      'APIPA',
      'Loopback'
    ],
    correctAnswer: 'Static IP'
  },
  {
    id: 'net-014',
    type: 'multiple-choice',
    question: 'Which topology provides the greatest path redundancy?',
    options: [
      'Bus',
      'Mesh',
      'Ring',
      'Star'
    ],
    correctAnswer: 'Mesh'
  },
  {
    id: 'net-015',
    type: 'multiple-choice',
    question: 'Which service automatically assigns IP addresses to devices?',
    options: [
      'DHCP',
      'DNS',
      'HTTP',
      'FTP'
    ],
    correctAnswer: 'DHCP'
  },
  {
    id: 'net-016',
    type: 'multiple-choice',
    question: 'Which device connects different IP networks?',
    options: [
      'Hub',
      'Repeater',
      'Router',
      'Access point'
    ],
    correctAnswer: 'Router'
  },
  {
    id: 'net-017',
    type: 'multiple-choice',
    question: 'Which topology is easy to expand by connecting a new device to a central switch?',
    options: [
      'Bus',
      'Star',
      'Ring',
      'Point-to-point'
    ],
    correctAnswer: 'Star'
  },
  {
    id: 'net-018',
    type: 'multiple-choice',
    question: 'What is generally appropriate for a printer that should retain the same network address?',
    options: [
      'APIPA',
      'Loopback',
      'Random dynamic address',
      'Static IP'
    ],
    correctAnswer: 'Static IP'
  },
  {
    id: 'net-019',
    type: 'multiple-choice',
    question: 'Two devices have the same IP address on one network. What is the problem?',
    options: [
      'DNS caching',
      'IP address conflict',
      'Loopback failure',
      'Normal DHCP behavior'
    ],
    correctAnswer: 'IP address conflict'
  },
  {
    id: 'net-020',
    type: 'multiple-choice',
    question: 'A computer can ping 127.0.0.1 but cannot reach the network. What does this suggest?',
    options: [
      'The Internet is working',
      'The local TCP/IP stack works, but network connectivity or configuration may be faulty',
      'The NIC is guaranteed functional',
      'The router is guaranteed functional'
    ],
    correctAnswer: 'The local TCP/IP stack works, but network connectivity or configuration may be faulty'
  },
  {
    id: 'net-021',
    type: 'multiple-choice',
    question: 'Why is a static IP commonly used for a server?',
    options: [
      'It prevents all attacks',
      'It improves CPU performance',
      'It keeps the server address consistent',
      'It replaces DNS'
    ],
    correctAnswer: 'It keeps the server address consistent'
  },
  {
    id: 'net-022',
    type: 'multiple-choice',
    question: 'A school needs a private system for faculty and staff. Which network type fits?',
    options: [
      'Intranet',
      'Extranet',
      'Public Internet',
      'APIPA'
    ],
    correctAnswer: 'Intranet'
  },
  {
    id: 'net-023',
    type: 'multiple-choice',
    question: 'Employees access a private internal HR portal. What is this an example of?',
    options: [
      'Intranet',
      'Extranet',
      'Public website',
      'Mesh network'
    ],
    correctAnswer: 'Intranet'
  },
  {
    id: 'net-024',
    type: 'multiple-choice',
    question: 'Which device regenerates or extends a network signal?',
    options: [
      'Router',
      'Repeater',
      'Switch',
      'Firewall'
    ],
    correctAnswer: 'Repeater'
  },
  {
    id: 'net-025',
    type: 'multiple-choice',
    question: 'What does 127.0.0.1 represent when testing a local web server?',
    options: [
      'Gateway',
      'Broadcast address',
      'Loopback / localhost',
      'DHCP server'
    ],
    correctAnswer: 'Loopback / localhost'
  },
  {
    id: 'net-026',
    type: 'multiple-choice',
    question: 'Several devices receive APIPA addresses. What should be checked first?',
    options: [
      'DHCP server availability and connectivity',
      'Website content',
      'Monitor resolution',
      'Printer toner'
    ],
    correctAnswer: 'DHCP server availability and connectivity'
  },
  {
    id: 'net-027',
    type: 'multiple-choice',
    question: 'How does a switch choose the port for forwarding an Ethernet frame?',
    options: [
      'It consults its MAC address table',
      'It forwards only by IP subnet',
      'It always broadcasts every frame',
      'It uses the destination URL'
    ],
    correctAnswer: 'It consults its MAC address table'
  },
  {
    id: 'net-028',
    type: 'multiple-choice',
    question: 'A hospital system is available only to authorized internal staff. Which network type is it?',
    options: [
      'Intranet',
      'Extranet',
      'Public Internet',
      'Peer-to-peer Internet'
    ],
    correctAnswer: 'Intranet'
  },
  {
    id: 'net-029',
    type: 'multiple-choice',
    question: 'In which topology does a single damaged computer cable typically leave other computers unaffected?',
    options: [
      'Star',
      'Bus',
      'Basic ring',
      'Daisy chain'
    ],
    correctAnswer: 'Star'
  },
  {
    id: 'net-030',
    type: 'multiple-choice',
    question: 'What does pinging 127.0.0.1 test?',
    options: [
      'Internet bandwidth',
      'DHCP lease duration',
      'Local TCP/IP stack',
      'Remote router'
    ],
    correctAnswer: 'Local TCP/IP stack'
  },
  {
    id: 'net-031',
    type: 'multiple-choice',
    question: 'What does address 169.254.80.12 typically indicate?',
    options: [
      'A valid public address',
      'Successful DHCP assignment',
      'Self-assigned APIPA address',
      'Loopback address'
    ],
    correctAnswer: 'Self-assigned APIPA address'
  },
  {
    id: 'net-032',
    type: 'multiple-choice',
    question: 'A university website is private to authorized students. Which type of network is it?',
    options: [
      'Public Internet',
      'Intranet',
      'Extranet for vendors',
      'WAN topology'
    ],
    correctAnswer: 'Intranet'
  },
  {
    id: 'net-033',
    type: 'multiple-choice',
    question: 'Why might a laptop get a different IP address after reconnecting?',
    options: [
      'Its MAC address becomes invalid',
      'Loopback changed',
      'A static address always rotates',
      'DHCP dynamic leases can assign different addresses'
    ],
    correctAnswer: 'DHCP dynamic leases can assign different addresses'
  },
  {
    id: 'net-034',
    type: 'multiple-choice',
    question: 'What happens if the main backbone cable is damaged in a bus topology?',
    options: [
      'Only one port is affected',
      'The entire network may be disrupted',
      'All nodes reroute through mesh links',
      'DHCP automatically repairs it'
    ],
    correctAnswer: 'The entire network may be disrupted'
  },
  {
    id: 'net-035',
    type: 'multiple-choice',
    question: 'What is the primary role of a router?',
    options: [
      'Route traffic between networks',
      'Amplify audio signals',
      'Store files only',
      'Assign MAC addresses'
    ],
    correctAnswer: 'Route traffic between networks'
  },
  {
    id: 'net-036',
    type: 'multiple-choice',
    question: 'Which network configuration information can DHCP supply?',
    options: [
      'Only an IP address',
      'Only a gateway',
      'Only a DNS server',
      'IP address, subnet mask, gateway, and DNS'
    ],
    correctAnswer: 'IP address, subnet mask, gateway, and DNS'
  },
  {
    id: 'net-037',
    type: 'multiple-choice',
    question: 'Why is a mesh topology useful for connecting routers?',
    options: [
      'It provides alternative paths through multiple peer links',
      'It requires only one backbone cable',
      'It prevents all packet loss',
      'It has no redundant links'
    ],
    correctAnswer: 'It provides alternative paths through multiple peer links'
  },
  {
    id: 'net-038',
    type: 'multiple-choice',
    question: 'A company provides a secure portal to authorized distributors outside its organization. Which network type is it?',
    options: [
      'Intranet',
      'Loopback',
      'APIPA',
      'Extranet'
    ],
    correctAnswer: 'Extranet'
  },
  {
    id: 'net-039',
    type: 'multiple-choice',
    question: 'A school has hundreds of student devices that frequently connect and disconnect from the network. Which IP configuration is generally more practical?',
    options: [
      'Dynamic IP addressing using DHCP',
      'Static IP for every student device',
      'Loopback addressing',
      'APIPA only'
    ],
    correctAnswer: 'Dynamic IP addressing using DHCP'
  },
  {
    id: 'net-040',
    type: 'multiple-choice',
    question: 'A technician connects several computers to a hub. When one computer sends data, the hub sends the signal out through all its ports. What explains this behavior?',
    options: [
      'A hub broadcasts the incoming signal to connected ports',
      'A hub assigns static IP addresses',
      'A hub performs IP routing',
      'A hub forwards traffic based on MAC addresses'
    ],
    correctAnswer: 'A hub broadcasts the incoming signal to connected ports'
  },
  {
    id: 'net-041',
    type: 'multiple-choice',
    question: "A student wants to determine whether a network problem is caused by the computer's own TCP/IP stack or by the physical network connection. Which test should be performed first?",
    options: [
      'Replace the router immediately',
      'Ping the loopback address',
      'Change the public IP address',
      'Ping a random website'
    ],
    correctAnswer: 'Ping the loopback address'
  },
  {
    id: 'net-042',
    type: 'multiple-choice',
    question: 'A company wants to control traffic entering and leaving its network according to security rules. Which device or technology is most appropriate?',
    options: [
      'Repeater',
      'Patch cable',
      'Hub',
      'Firewall'
    ],
    correctAnswer: 'Firewall'
  },
  {
    id: 'net-043',
    type: 'multiple-choice',
    question: 'A company allows its employees to access internal resources, while selected suppliers can access a specific inventory portal using authorized accounts. What network concept is being used?',
    options: [
      'Loopback',
      'Intranet',
      'Extranet',
      'LAN only'
    ],
    correctAnswer: 'Extranet'
  },
  {
    id: 'net-044',
    type: 'multiple-choice',
    question: 'A server hosts a website for employees and must consistently be accessible using the same network address. Which configuration is generally preferable?',
    options: [
      'Loopback only',
      'APIPA',
      'Static IP',
      'Dynamic IP without reservation'
    ],
    correctAnswer: 'Static IP'
  },
  {
    id: 'net-045',
    type: 'multiple-choice',
    question: 'A business gives an external partner limited access to selected company resources without allowing access to the entire internal network. What is the main purpose of an extranet?',
    options: [
      'To connect authorized external users to selected internal resources',
      'To provide unrestricted Internet access',
      'To eliminate network security',
      'To replace all network devices'
    ],
    correctAnswer: 'To connect authorized external users to selected internal resources'
  },
  {
    id: 'net-046',
    type: 'multiple-choice',
    question: 'A company wants employees to connect their wireless laptops to the wired office network. Which device is most appropriate?',
    options: [
      'Hub',
      'Access Point',
      'Repeater',
      'Patch panel'
    ],
    correctAnswer: 'Access Point'
  },
  {
    id: 'net-047',
    type: 'multiple-choice',
    question: "A computer has a valid IP address, but the network administrator wants to test the computer's own networking interface without involving the network cable or router. Which address is most appropriate?",
    options: [
      'Loopback address',
      'Broadcast address',
      'Gateway address',
      'APIPA address'
    ],
    correctAnswer: 'Loopback address'
  },
  {
    id: 'net-048',
    type: 'multiple-choice',
    question: 'A wireless access point is connected to a switch. What is the main function of the access point?',
    options: [
      'Provide wireless network connectivity',
      'Assign each device a loopback address',
      'Replace the router',
      'Convert private IP addresses into APIPA addresses'
    ],
    correctAnswer: 'Provide wireless network connectivity'
  },
  {
    id: 'net-049',
    type: 'multiple-choice',
    question: "The PC has the address 169.254.25.10. The user cannot access the Internet and cannot communicate normally with the organization's network. What is a likely explanation?",
    options: [
      'The PC is using a loopback address',
      'The PC has a valid public IP address',
      'The router assigned a static public address',
      'The PC may have failed to obtain an IP address from DHCP'
    ],
    correctAnswer: 'The PC may have failed to obtain an IP address from DHCP'
  },
  {
    id: 'net-050',
    type: 'multiple-choice',
    question: 'A technician runs ping 127.0.0.1 and receives replies. What does this primarily indicate?',
    options: [
      'The local TCP/IP stack is responding',
      'The router has Internet access',
      'The DHCP server is working',
      'The Internet connection is guaranteed to work'
    ],
    correctAnswer: 'The local TCP/IP stack is responding'
  }
];
