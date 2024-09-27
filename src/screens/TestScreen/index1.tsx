// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import Zeroconf, { Service } from 'react-native-zeroconf';

// const zeroconf = new Zeroconf();

// const MDNSDiscovery = () => {
//   const [serviceFound, setServiceFound] = useState(null);
//   const [resolvedService, setResolvedService] = useState<Service>();  // State for resolved service
//   const [wsConnected, setWsConnected] = useState(false);
//   const [error, setError] = useState(null);
//   const [ws, setWs] = useState(null);  // State to hold WebSocket instance
//   const [messages, setMessages] = useState<any[]>([]);  // State to hold received messages
//   const flatListRef = useRef(null);  // Reference for FlatList

//   useEffect(() => {
//     // Start Zeroconf service discovery for WebSocket services
//     zeroconf.scan('websocket', 'tcp', 'local.');

//     // Event listeners for Zeroconf
//     zeroconf.on('start', () => console.log('Zeroconf scan started.'));

//     zeroconf.on('found', (serviceName) => {
//       console.log('Service found:', serviceName);
//     });

//     zeroconf.on('resolved', (service) => {
//       console.log('Service resolved:', service);

//       // Check if this is the service we are looking for
//       if (service.name === 'timesp1' && service.addresses.length > 0) {
//         setResolvedService(service);  // Update state with resolved service details
//         const host = service.addresses[0];  // Get the first available IP address
//         const port = service.port;
//         setServiceFound({ host, port });

//         // Establish a WebSocket connection using the discovered host and port
//         const wsUrl = `ws://${host}:${port}/ws`;  // Build WebSocket URL
//         console.log(wsUrl);
//         const newWs = new WebSocket(wsUrl);

//         // Set WebSocket event listeners
//         newWs.onopen = () => {
//           console.log('WebSocket connection opened');
//           setWsConnected(true);
//         };

//         newWs.onmessage = (e) => {
//           console.log('Received message from WebSocket:', e.data);
//           setMessages((prevMessages) => [...prevMessages, e.data]);  // Update state with new message
//           flatListRef.current!.scrollToEnd();  // Scroll to the end of the FlatList
//         };

//         newWs.onerror = (e) => {
//           console.error('WebSocket error:', e.message);
//           setError(e.message);
//         };

//         newWs.onclose = (e) => {
//           console.log('WebSocket connection closed:', e.code, e.reason);
//           setWsConnected(false);
//           setWs(null);  // Clear the WebSocket instance after it closes
//         };

//         setWs(newWs);  // Store WebSocket instance in state
//       }
//     });

//     zeroconf.on('error', (err) => {
//       console.error('Zeroconf error:', err);
//       setError(err.message);
//     });

//     // Cleanup: Stop the scan and close WebSocket when component unmounts
//     return () => {
//       zeroconf.stop();
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, []);  // Dependency on wsConnected and ws to manage connection

//   return (
//     <View style={styles.container}>
//       {error ? <Text style={styles.error}>Error: {error.toString()}</Text> : null}
//       {serviceFound ? (
//         <Text style={styles.service}>Found service at {serviceFound.host}:{serviceFound.port}</Text>
//       ) : (
//         <Text style={styles.discovery}>Discovering service...</Text>
//       )}
//       {resolvedService ? (
//         <View style={styles.resolvedService}>
//           <Text style={styles.resolvedTitle}>Resolved Service:</Text>
//           <Text>Name: {resolvedService.name}</Text>
//           <Text>Host: {resolvedService.addresses.join(', ')}</Text>
//           <Text>Port: {resolvedService.port}</Text>
//         </View>
//       ) : null}
//       {wsConnected ? <Text style={styles.connected}>WebSocket Connected!</Text> : <Text style={styles.disconnected}>WebSocket Not Connected</Text>}
//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
//         contentContainerStyle={styles.messageContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   error: {
//     color: 'red',
//   },
//   service: {
//     fontWeight: 'bold',
//   },
//   discovery: {
//     color: 'gray',
//   },
//   resolvedService: {
//     marginVertical: 16,
//     padding: 8,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 4,
//     backgroundColor: '#000000',
//   },
//   resolvedTitle: {
//     fontWeight: 'bold',
//     color: 'green',
//   },
//   connected: {
//     color: 'green',
//   },
//   disconnected: {
//     color: 'red',
//   },
//   messageContainer: {
//     paddingVertical: 8,
//   },
//   message: {
//     fontSize: 16,
//     paddingVertical: 4,
//     color: 'green',
//   },
// });

// export default MDNSDiscovery;
