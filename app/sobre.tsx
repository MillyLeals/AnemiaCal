import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native'; 
import BackButton from '../components/BackButton';
import { AntDesign } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window'); 

export default function Sobre() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <View style={styles.fullScreenContainer}> 
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Sobre o Aplicativo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollViewFlex}>
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>O AnemiaCal</Text> é um aplicativo desenvolvido para{' '}
            <Text style={styles.bold}>
              ajudar profissionais da saúde a diferenciar de forma prática e rápida a Anemia Ferropriva e Talassemias Menores
            </Text>, especialmente em pacientes com <Text style={styles.bold}>microcitose</Text>.
          </Text>

          <Text style={styles.paragraph}>
            O <Text style={styles.bold}>objetivo principal</Text> do aplicativo é{' '}
            <Text style={styles.bold}>facilitar o diagnóstico</Text>, oferecendo{' '}
            <Text style={styles.bold}>benefícios clínicos importantes</Text>, como:
          </Text>

          <Text style={styles.bullet}>• <Text style={styles.bold}>Redução de custos</Text> com exames laboratoriais desnecessários;</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Agilidade no diagnóstico</Text>, economizando tempo no atendimento ao paciente;</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Apoio à decisão clínica</Text>, orientando o tratamento adequado da anemia ferropriva em <Text style={styles.bold}>adultos e crianças</Text>;</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Auxílio no aconselhamento genético</Text> de pacientes com talassemias menores.</Text>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowInstructions(!showInstructions)}
          >
            <Text style={styles.toggleButtonText}>
              {showInstructions ? 'Ocultar Instruções' : 'Mostrar Instruções'}
            </Text>
            <AntDesign
              name={showInstructions ? 'up' : 'down'}
              size={width * 0.05} 
              color="#fff"
              style={{ marginLeft: width * 0.02 }} 
            />
          </TouchableOpacity>

          {showInstructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>📌 Como Usar o Aplicativo</Text>

              {/* BLOCO 1 */}
              <View style={styles.instructionBlock}>
                <Text style={styles.sectionTitle}>🏠 Tela Home</Text>
                <Text style={styles.instructionText}>
                  A tela principal do AnemiaCal, onde você acessa todas as funcionalidades:
                </Text>
              </View>

              {/* BLOCO 2 */}
              <View style={styles.instructionBlock}>
                <Text style={styles.sectionTitle}>📝 Cadastrar</Text>
                <Text style={styles.instructionText}>
                  Registre um paciente. Após o cadastro:
                </Text>
                <Text style={styles.bullet}>• Idade &gt; 14 anos → Calculadora <Text style={styles.bold}>IGK</Text> será exibida.</Text>
                <Text style={styles.bullet}>• Idade ≤ 14 anos → Calculadora <Text style={styles.bold}>EHSANI</Text> será aberta.</Text>
              </View>

              {/* BLOCO 3 */}
              <View style={styles.instructionBlock}>
                <Text style={styles.sectionTitle}>📂 Pacientes</Text>
                <Text style={styles.bullet}>• Pesquise por nome</Text>
                <Text style={styles.bullet}>• Edite dados de pacientes</Text>
                <Text style={styles.bullet}>• Veja resultados anteriores</Text>
                <Text style={styles.bullet}>• Acesse calculadoras específicas</Text>
                <Text style={styles.bullet}>• Cadastre rapidamente um novo paciente</Text>
              </View>

              {/* BLOCO 4 */}
              <View style={styles.instructionBlock}>
                <Text style={styles.sectionTitle}>🧮 Calculadora</Text>
                <Text style={styles.instructionText}>
                  Use as calculadoras sem precisar vincular a um paciente.
                </Text>
                <Text style={styles.bullet}>• Ideal para testes rápidos</Text>
                <Text style={styles.bullet}>• <Text style={styles.bold}>Atenção:</Text> dados não são salvos sem cadastro</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewFlex: { 
    flex: 1,
  },
  scrollContent: {
    paddingBottom: height * 0.04, 
    backgroundColor: '#fff',
    flexGrow: 1, 
  },
  header: {
    backgroundColor: '#F46F6F',
    height: Platform.OS === 'ios' ? height * 0.12 : height * 0.1, 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.03, 
    paddingHorizontal: width * 0.05, 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    color: '#fff',
    fontSize: width * 0.055, 
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: width * 0.05, 
  },
  paragraph: {
    fontSize: width * 0.04, 
    color: '#444',
    marginBottom: height * 0.015, 
    lineHeight: width * 0.06, 
    textAlign: 'justify',
  },
  bullet: {
    fontSize: width * 0.04, 
    color: '#444',
    marginBottom: height * 0.01, 
    lineHeight: width * 0.06, 
    paddingLeft: width * 0.02, 
  },
  bold: {
    fontWeight: 'bold',
  },
  toggleButton: {
    flexDirection: 'row',
    backgroundColor: '#F46F6F',
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: height * 0.025, 
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04, 
  },
  instructionsContainer: {
    marginTop: height * 0.025, 
    padding: width * 0.04, 
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#F46F6F',
    marginBottom: height * 0.015, 
    textAlign: 'center',
  },
  instructionBlock: {
    marginBottom: height * 0.02, 
    padding: width * 0.03, 
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: width * 0.045, 
    fontWeight: 'bold',
    marginBottom: height * 0.01, 
    color: '#333',
  },
  instructionText: {
    fontSize: width * 0.038, 
    color: '#555',
    marginBottom: height * 0.008, 
    lineHeight: width * 0.055, 
  },
});