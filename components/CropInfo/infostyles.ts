import { StyleSheet } from 'react-native';

const sharedStyles = StyleSheet.create({
  infoBox: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 10,
  },
});

export default sharedStyles;
