export const questions = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'How does role separation improve server security?',
    options: [
      'By installing applications on separate hard disks.',
      'By physically separating high-security servers from other servers.',
      'By enforcing the principle of least privilege.',
      'By placing servers on separate VLANs.'
    ],
    correctAnswer: 'By enforcing the principle of least privilege.'
  },
  {
    id: '2',
    type: 'multi-part',
    question: 'For each statement, select True or False.',
    parts: [
      {
        label: 'Statement 1: Because senior executives have rights to access sensitive data, they should use administrator accounts.',
        options: ['True', 'False']
      },
      {
        label: 'Statement 2: One purpose of User Account Control (UAC) is to grant users the lowest level permissions required to complete their tasks.',
        options: ['True', 'False']
      },
      {
        label: 'Statement 3: System administrators should use a standard user account when performing routine functions like reading emails and browsing the internet.',
        options: ['True', 'False']
      }
    ],
    correctAnswer: {
      'Statement 1: Because senior executives have rights to access sensitive data, they should use administrator accounts.': 'False',
      'Statement 2: One purpose of User Account Control (UAC) is to grant users the lowest level permissions required to complete their tasks.': 'True',
      'Statement 3: System administrators should use a standard user account when performing routine functions like reading emails and browsing the internet.': 'True'
    }
  },
  {
    id: '3',
    type: 'multi-part',
    imagePlaceholder: true,
    question: 'Your supervisor asks you to review file permission settings on the application.bat file. You need to report which file system the file is on and the type of permission the file has.',
    parts: [
      {
        label: 'Statement 1: The "application.bat" file in the image is currently on the __________ file system.',
        options: ['NTFS', 'FAT32', 'exFAT']
      },
      {
        label: 'Statement 2: __________ permissions are currently being displayed for the "application.bat" file.',
        options: ['Everyone', 'Administrators', 'Users']
      }
    ],
    correctAnswer: {
      'Statement 1: The "application.bat" file in the image is currently on the __________ file system.': 'NTFS',
      'Statement 2: __________ permissions are currently being displayed for the "application.bat" file.': 'Everyone'
    }
  },
  {
    id: '4',
    type: 'match',
    question: 'Match each policy description to the correct policy.',
    definitions: [
      'A policy that defines the requirements to connect to a computer network from outside that network',
      'A policy that grants or revokes permissions for an employee or a group of employees on a computer network',
      'A policy that defines actions to take after an unexpected or uncommon event',
      'A policy that describes permissible behaviors on a computer network'
    ],
    terms: [
      'Remote Access Policy',
      'Access Control Policy',
      'Incident Response Policy',
      'Acceptable Use Policy'
    ],
    correctAnswer: {
      'A policy that defines the requirements to connect to a computer network from outside that network': 'Remote Access Policy',
      'A policy that grants or revokes permissions for an employee or a group of employees on a computer network': 'Access Control Policy',
      'A policy that defines actions to take after an unexpected or uncommon event': 'Incident Response Policy',
      'A policy that describes permissible behaviors on a computer network': 'Acceptable Use Policy'
    }
  },
  {
    id: '5',
    type: 'multiple-choice',
    question: 'What is a user probably receiving if they get a large number of emails selling prescription medicine?',
    options: [
      'Spam',
      'Malware',
      'Pharming mail',
      'Spoofed mail'
    ],
    correctAnswer: 'Spam'
  },
  {
    id: '6',
    type: 'multiple-choice',
    question: 'You create a web server for your school. When users visit your site, they get a certificate error that says your site is not trusted. What should you do to fix this problem?',
    options: [
      'Enable Public Keys on your website.',
      'Use a digital signature.',
      'Generate a certificate request.',
      'Install a certificate from a trusted Certificate Authority (CA).'
    ],
    correctAnswer: 'Install a certificate from a trusted Certificate Authority (CA).'
  },
  {
    id: '7',
    type: 'multiple-choice',
    question: 'Creating MD5 hash for files is an example of ensuring what?',
    options: [
      'Integrity',
      'Availability',
      'Confidentiality',
      'Least privilege'
    ],
    correctAnswer: 'Integrity'
  },
  {
    id: '8',
    type: 'multiple-choice',
    question: 'Which link is a valid secure link to the CompanyPro account management site?',
    options: [
      'http://secure.companypro/SecureSignIn',
      'http://VPN.VisitMe/logon.html',
      'https://companypro/SecureSignIn/',
      'http://VPN.VisitMe/SecureSignIn/'
    ],
    correctAnswer: 'https://companypro/SecureSignIn/'
  },
  {
    id: '9',
    type: 'multi-part',
    question: 'For each statement, select True or False.',
    parts: [
      {
        label: 'Statement 1: To protect users from malicious browser pop-ups, you should set a default browser configuration that blocks untrusted pop-ups.',
        options: ['True', 'False']
      },
      {
        label: 'Statement 2: Pop-ups can display a realistic operating system or application error message.',
        options: ['True', 'False']
      },
      {
        label: 'Statement 3: Protecting users from untrusted pop-up applications is mostly a function of awareness.',
        options: ['True', 'False']
      }
    ],
    correctAnswer: {
      'Statement 1: To protect users from malicious browser pop-ups, you should set a default browser configuration that blocks untrusted pop-ups.': 'True',
      'Statement 2: Pop-ups can display a realistic operating system or application error message.': 'True',
      'Statement 3: Protecting users from untrusted pop-up applications is mostly a function of awareness.': 'False'
    }
  },
  {
    id: '10',
    type: 'match',
    question: 'You work on a team responsible for planning a backup strategy for a file server. Approximately 25% of the files on the server are modified each day. Move each backup strategy from the list on the left to its recovery time description on the right.\n\nStrategy 1: Full backup every night\nStrategy 2: Full backup Sunday night and an incremental backup Monday through Saturday night\nStrategy 3: Full backup Sunday night and a differential backup Monday through Saturday night',
    definitions: [
      'Method with fastest data recovery time',
      'Method with intermediate data recovery time',
      'Method with slowest data recovery time'
    ],
    terms: [
      'Strategy 1',
      'Strategy 2',
      'Strategy 3'
    ],
    correctAnswer: {
      'Method with fastest data recovery time': 'Strategy 1',
      'Method with intermediate data recovery time': 'Strategy 2',
      'Method with slowest data recovery time': 'Strategy 3'
    }
  },
  {
    id: '11',
    type: 'multiple-choice',
    question: 'How should the certificate of a secure public web server on the internet be signed?',
    options: [
      'By an enterprise certificate authority (CA)',
      'By a public certificate authority (CA)',
      'By using a 4096-bit key',
      'By using a 1024-bit key'
    ],
    correctAnswer: 'By a public certificate authority (CA)'
  },
  {
    id: '12',
    type: 'multiple-choice',
    question: 'You need to implement a firewall that includes examining the origin of the data. Which type of firewall should you implement?',
    options: [
      'Application layer',
      'Stateful',
      'Content filter',
      'Network layer'
    ],
    correctAnswer: 'Application layer'
  },
  {
    id: '13',
    type: 'multiple-choice',
    question: 'What should you use to protect systems from buffer overflow errors?',
    options: [
      'An Intruder Prevention System',
      'Data Execution Prevention',
      'Antivirus software',
      'A proxy server'
    ],
    correctAnswer: 'Data Execution Prevention'
  },
  {
    id: '14',
    type: 'multiple-choice',
    question: 'Your anti-spam program is blocking emails from a particular sender. Your company needs to receive emails from them. What should you do?',
    options: [
      'Add the email address to the whitelist.',
      'List the sender\'s email address in DNS.',
      'Accept RSS feeds from their domain.',
      'Reconfigure the SMS Gateway.'
    ],
    correctAnswer: 'Add the email address to the whitelist.'
  },
  {
    id: '15',
    type: 'multiple-choice',
    question: 'Which networking protocol provides centralized authentication, authorization, and accounting?',
    options: [
      'HTTPS',
      'OpenID',
      'RADIUS',
      'SMTP'
    ],
    correctAnswer: 'RADIUS'
  },
  {
    id: '16',
    type: 'multiple-choice',
    question: 'You are an intern at Sunset Web. You help manage 1000 workstations. All the workstations are members of an Active Directory Domain. You need to push an application security patch to all workstations. What is the quickest method to do this?',
    options: ['Local security policy', 'Logon script', 'Windows Update', 'Group policy'],
    correctAnswer: 'Group policy'
  },
  {
    id: '17',
    type: 'multiple-choice',
    question: 'You install a system-file checksum-verification application on your servers. What does this help to ensure?',
    options: ['Confidentiality', 'Integrity', 'Accessibility', 'Availability'],
    correctAnswer: 'Integrity'
  },
  {
    id: '18',
    type: 'multiple-choice',
    question: 'Which type of password attack attempts to guess passwords by using a list of common passwords?',
    options: ['Rainbow table', 'Brute force', 'Keylogger', 'Dictionary'],
    correctAnswer: 'Dictionary'
  },
  {
    id: '19',
    type: 'multiple-choice',
    question: 'Why should you implement a wireless intrusion prevention system?',
    options: ['To prevent rogue wireless access points', 'To enforce SSID broadcasting', 'To prevent wireless interference', 'To detect wireless packet theft'],
    correctAnswer: 'To prevent rogue wireless access points'
  },
  {
    id: '20',
    type: 'multiple-select',
    requiredCount: 3,
    question: 'What are three major attack vectors that a social engineering hacker might use? (Choose 3.)',
    options: ['Honeypot systems', 'Dumpster diving', 'Telephone', 'Firewall interface', 'Reverse social engineering'],
    correctAnswer: ['Dumpster diving', 'Telephone', 'Reverse social engineering']
  },
  {
    id: '21',
    type: 'multi-part',
    question: 'For each statement, select True or False.',
    parts: [
      { label: 'You can view audit logs in the Event Viewer.', options: ['True', 'False'] },
      { label: 'Audit logs have a set size limit and cannot be adjusted.', options: ['True', 'False'] },
      { label: 'You can configure an event notification for an audited activity.', options: ['True', 'False'] }
    ],
    correctAnswer: {
      'You can view audit logs in the Event Viewer.': 'True',
      'Audit logs have a set size limit and cannot be adjusted.': 'False',
      'You can configure an event notification for an audited activity.': 'True'
    }
  },
  {
    id: '22',
    type: 'multiple-select',
    requiredCount: 2,
    question: 'Which two vulnerabilities is a wireless network client exposed to? (Choose 2.)',
    options: ['File corruption', 'Rogue access points', 'Eavesdropping', 'Buffer overflow'],
    correctAnswer: ['Rogue access points', 'Eavesdropping']
  },
  {
    id: '23',
    type: 'multiple-select',
    requiredCount: 2,
    question: 'You are responsible for ensuring that your network computers remain virus and malware free. Which two strategies will help keep your devices free from viruses and malware? (Choose 2.)',
    options: [
      'Keep antivirus and anti-malware software definitions are up to date.',
      'Ensure that the Windows Firewall is disabled...',
      'Ensure that all network ports are available...',
      'Ensure that Real-time Protection is disabled.',
      'Configure full antivirus and anti-malware scans to run automatically on a regular schedule.'
    ],
    correctAnswer: [
      'Keep antivirus and anti-malware software definitions are up to date.',
      'Configure full antivirus and anti-malware scans to run automatically on a regular schedule.'
    ]
  },
  {
    id: '24',
    type: 'multiple-choice',
    question: 'Your organization has a Windows Bring Your Own Device (BYOD) policy that includes ensuring that all devices are protected against various malware attacks. Where should you go on the local device to verify and configure the appropriate settings?',
    options: ['Device Performance and Health', 'Account Protection', 'Virus & Threat Protection', 'User Account Control'],
    correctAnswer: 'Virus & Threat Protection'
  },
  {
    id: '25',
    type: 'multiple-choice',
    question: 'What is an example of physical security for a laptop?',
    options: ['Fingerprint reader', 'Cable lock', 'Docking station', 'External USB drive'],
    correctAnswer: 'Cable lock'
  },
  {
    id: '26',
    type: 'multiple-choice',
    question: 'Which term refers to a physical opportunity that a hacker might use to look for information about a computer network?',
    options: ['Reverse social engineering', 'Phishing', 'Dumpster diving', 'Malware'],
    correctAnswer: 'Dumpster diving'
  },
  {
    id: '27',
    type: 'multiple-choice',
    question: 'You are a network administrator. All computers run the Chrome browser. You need to prevent third-party cookies from being saved. What should you enforce?',
    options: ['Antivirus protection', 'Cross-Site Scripting Filter', 'Incognito', 'SmartScreen Filter'],
    correctAnswer: 'Incognito'
  },
  {
    id: '28',
    type: 'multiple-choice',
    question: 'What can intercept passwords that are transmitted in clear text?',
    options: ['A Kerberos client', 'A rogue DHCP server', 'An IPsec decoder', 'A packet sniffer'],
    correctAnswer: 'A packet sniffer'
  },
  {
    id: '29',
    type: 'multiple-choice',
    question: 'The client computers on your network are stable and do not need any new features. What is a benefit of applying operating system updates to these clients?',
    options: ['Update the hardware firewall.', 'Keep the software licensed.', 'Close existing vulnerabilities.', 'Keep the server ports available.'],
    correctAnswer: 'Close existing vulnerabilities.'
  },
  {
    id: '30',
    type: 'multiple-choice',
    question: 'You need to hide internal IP addresses from the internet while maintaining client internet access. What should you implement?',
    options: ['Secure Sockets Layer (SSL)', 'Access Control Lists', 'Network Address Translation (NAT)', 'Port forwarding'],
    correctAnswer: 'Network Address Translation (NAT)'
  },
  {
    id: '31',
    type: 'multiple-choice',
    question: 'You have two servers that run Windows Server. All the server drives have been formatted by using NTFS. You move a file from one server to the other server. What permissions does the file have in the new location?',
    options: ['The file retains the original folder\'s permissions.', 'Access will be limited to members of the Administrators group.', 'The file inherits the destination folder\'s permissions.', 'Members of the Everyone group will have full access to the file.'],
    correctAnswer: 'The file inherits the destination folder\'s permissions.'
  },
  {
    id: '32',
    type: 'match',
    question: 'You are a junior network administrator for CompanyPro. You have an off-domain computer that you suspect is infected with malware. After running anti-malware, you are unsure whether the infection has been completely removed. You need to ensure that the computer is completely safe and the user files are available. In which sequence should you complete the actions?',
    definitions: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
    terms: [
      'Back up the entire system.',
      'Reformat the disk.',
      'Reinstall the OS and applications from the original media.',
      'Update everything, including the OS, applications, and anti-virus/anti-malware tools.',
      'Restore the user data from the backup image.'
    ],
    correctAnswer: {
      'Step 1': 'Back up the entire system.',
      'Step 2': 'Reformat the disk.',
      'Step 3': 'Reinstall the OS and applications from the original media.',
      'Step 4': 'Update everything, including the OS, applications, and anti-virus/anti-malware tools.',
      'Step 5': 'Restore the user data from the backup image.'
    }
  },
  {
    id: '34',
    type: 'multiple-choice',
    question: 'Which technology examines packet header information to determine whether network traffic is allowed to enter the internal network?',
    options: ['Dedicated firewall', 'RADIUS server', 'BitLocker To Go', 'Antivirus software'],
    correctAnswer: 'Dedicated firewall'
  },
  {
    id: '35',
    type: 'multiple-select',
    requiredCount: 2,
    question: 'What are two benefits to using an incremental backup solution instead of a differential backup solution? (Choose 2.)',
    options: ['Less storage space required', 'Less time needed to back up data', 'Less administrative effort', 'Less time needed to recover data'],
    correctAnswer: ['Less storage space required', 'Less time needed to back up data']
  },
  {
    id: '33',
    type: 'multiple-choice',
    question: 'What is the first step when conducting a physical security audit?',
    options: [
      'Inventory the company’s technology assets',
      'Set up the system logs to audit security events.',
      'Set up a virus quarantine area.',
      'Install auditing software on your servers.'
    ],
    correctAnswer: 'Inventory the company’s technology assets'
  },
  {
    id: '36',
    type: 'multi-part',
    question: 'For each statement, select True or False.',
    parts: [
      { label: 'IPsec requires network applications to be IPsec aware', options: ['True', 'False'] },
      { label: 'IPsec can encrypt data', options: ['True', 'False'] },
      { label: 'IPsec adds overhead for all network communications for which it is used', options: ['True', 'False'] }
    ],
    correctAnswer: {
      'IPsec requires network applications to be IPsec aware': 'False',
      'IPsec can encrypt data': 'True',
      'IPsec adds overhead for all network communications for which it is used': 'True'
    }
  },
  {
    id: '37',
    type: 'multiple-select',
    requiredCount: 3,
    question: 'What are three examples of two-factor authentication? (Choose 3.)',
    options: [
      'A username and a password',
      'A password and a PIN number',
      'A fingerprint and a pattern',
      'A password and a smart card',
      'A PIN number and a debit card'
    ],
    correctAnswer: [
      'A fingerprint and a pattern',
      'A password and a smart card',
      'A PIN number and a debit card'
    ]
  },
  {
    id: '38',
    type: 'multiple-choice',
    question: 'You are the junior network administrator at your company. You learn that several employees within your organization have downloaded and installed a browser extension that will translate text from one language to another. What should you do?',
    options: [
      'Disable the browser extension and implement controls to allow only corporate-approved browser extensions.',
      'Make sure the browser extension is set to read-only mode, so it cannot overwrite critical information.',
      'Remove the browser extension because it will perform malicious activities.',
      'Nothing, browser extensions pose no harm to the machine or the user.'
    ],
    correctAnswer: 'Disable the browser extension and implement controls to allow only corporate-approved browser extensions.'
  },
  {
    id: '39',
    type: 'multiple-choice',
    question: 'You have an application that uses IPsec to secure communications between an internet client and a server on the internal network. To which network security service must the IPsec client connect?',
    options: [
      'SFTP',
      'VPN',
      'SSH',
      'RADIUS'
    ],
    correctAnswer: 'VPN'
  },
  {
    id: '40',
    type: 'multiple-choice',
    question: 'You are an intern for a company. Your manager wants to be sure that you understand the types of social engineering threats that might occur. Which type of threat mitigation educates the staff within an organization, explaining what to do, when, why, and by whom?',
    options: [
      'Acceptable Use Policy',
      'Physical Security',
      'Defense in Depth',
      'Policies, Procedures, and Awareness'
    ],
    correctAnswer: 'Policies, Procedures, and Awareness'
  }
];
