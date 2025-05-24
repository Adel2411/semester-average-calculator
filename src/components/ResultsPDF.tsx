import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormValues } from '@/lib/schemas';

interface ResultsPDFProps {
  data: FormValues;
  average: number;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666666',
  },
  averageSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
  },
  averageText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  passStatus: {
    color: '#22c55e',
  },
  failStatus: {
    color: '#ef4444',
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
    fontSize: 10,
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontSize: 11,
    fontWeight: 'bold',
  },
  col1: {
    width: '40%',
  },
  col2: {
    width: '20%',
    textAlign: 'center',
  },
  col3: {
    width: '20%',
    textAlign: 'center',
  },
  col4: {
    width: '20%',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});

export function ResultsPDF({ data, average }: ResultsPDFProps) {
  const totalCoefficients = data.modules.reduce(
    (sum, module) => sum + module.coefficient,
    0
  );

  const status = average >= 10 ? 'Pass' : 'Fail';
  const statusStyle = average >= 10 ? styles.passStatus : styles.failStatus;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Semester Average Report</Text>
        <Text style={styles.subheader}>Academic Performance Summary</Text>
        
        <View style={styles.averageSection}>
          <Text style={styles.averageText}>
            Semester Average: {average.toFixed(2)}/20
          </Text>
          <Text style={[styles.statusText, statusStyle]}>
            Status: {status}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Module Name</Text>
            <Text style={styles.col2}>Coefficient</Text>
            <Text style={styles.col3}>Score</Text>
            <Text style={styles.col4}>Weighted</Text>
          </View>
          
          {data.modules.map((module, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{module.name}</Text>
              <Text style={styles.col2}>{module.coefficient}</Text>
              <Text style={styles.col3}>{module.average}/20</Text>
              <Text style={styles.col4}>
                {(module.average * module.coefficient).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.totalRow}>
            <Text style={styles.col1}>TOTAL</Text>
            <Text style={styles.col2}>{totalCoefficients}</Text>
            <Text style={styles.col3}></Text>
            <Text style={styles.col4}>
              {(average * totalCoefficients).toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} - Semester Average Calculator
        </Text>
      </Page>
    </Document>
  );
}
