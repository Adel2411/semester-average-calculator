import React from 'react';
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
    padding: 50,
    fontFamily: 'Helvetica',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 32,
    textAlign: 'center',
  },
  
  table: {
    marginBottom: 32,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f1f5f9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#cbd5e1',
  },
  
  moduleNameCol: {
    flex: 2,
  },
  
  coefficientCol: {
    flex: 1,
    textAlign: 'center',
  },
  
  averageCol: {
    flex: 1,
    textAlign: 'center',
  },
  
  weightedCol: {
    flex: 1,
    textAlign: 'center',
  },
  
  headerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  cellText: {
    fontSize: 11,
    color: '#334155',
  },
  
  totalText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  
  summarySection: {
    alignItems: 'center',
    marginTop: 20,
  },
  
  finalAverage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
  },
  
  pass: {
    color: '#16a34a',
  },
  
  fail: {
    color: '#dc2626',
  },
  
  passBg: {
    backgroundColor: '#dcfce7',
  },
  
  failBg: {
    backgroundColor: '#fee2e2',
  },
});

export function ResultsPDF({ data, average }: ResultsPDFProps) {
  const status = average >= 10 ? 'PASS' : 'FAIL';
  const isPass = average >= 10;
  const totalCoefficients = data.modules.reduce((sum, module) => sum + module.coefficient, 0);
  const totalWeightedScore = data.modules.reduce((sum, module) => sum + (module.average * module.coefficient), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Academic Results</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.moduleNameCol}>
              <Text style={styles.headerText}>Module</Text>
            </View>
            <View style={styles.coefficientCol}>
              <Text style={styles.headerText}>Coeff.</Text>
            </View>
            <View style={styles.averageCol}>
              <Text style={styles.headerText}>Score</Text>
            </View>
            <View style={styles.weightedCol}>
              <Text style={styles.headerText}>Weighted</Text>
            </View>
          </View>

          {data.modules.map((module, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.moduleNameCol}>
                <Text style={styles.cellText}>{module.name}</Text>
              </View>
              <View style={styles.coefficientCol}>
                <Text style={styles.cellText}>{module.coefficient}</Text>
              </View>
              <View style={styles.averageCol}>
                <Text style={styles.cellText}>{module.average.toFixed(2)}</Text>
              </View>
              <View style={styles.weightedCol}>
                <Text style={styles.cellText}>{(module.average * module.coefficient).toFixed(2)}</Text>
              </View>
            </View>
          ))}

          <View style={styles.totalRow}>
            <View style={styles.moduleNameCol}>
              <Text style={styles.totalText}>TOTAL</Text>
            </View>
            <View style={styles.coefficientCol}>
              <Text style={styles.totalText}>{totalCoefficients}</Text>
            </View>
            <View style={styles.averageCol}>
              <Text style={styles.totalText}>—</Text>
            </View>
            <View style={styles.weightedCol}>
              <Text style={styles.totalText}>{totalWeightedScore.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={[styles.finalAverage, isPass ? styles.pass : styles.fail]}>
            {average.toFixed(2)}/20
          </Text>
          <View style={[styles.statusText, isPass ? styles.passBg : styles.failBg]}>
            <Text style={[styles.statusText, isPass ? styles.pass : styles.fail]}>
              {status}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
