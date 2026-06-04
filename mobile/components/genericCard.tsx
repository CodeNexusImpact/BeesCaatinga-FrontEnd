import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@/components/icon';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

export interface CardField {
  label: string;
  value: string | number;
  valueStyle?: object;
}

export interface CardAction {
  iconName: string;
  onPress: () => void;
  color?: string;
  size?: number;
}

interface GenericCardProps {
  id: number;
  fields: CardField[];
  actions?: CardAction[];
  containerStyle?: object;
}

export default function GenericCard({
  id,
  fields,
  actions = [],
  containerStyle,
}: GenericCardProps) {
  return (
    <View style={[styles.card, containerStyle]}>
      {/* Coluna da Esquerda: Textos */}
      <View style={styles.body}>
        <Text style={styles.idText}>ID: {id}</Text>
        {fields.map((field, index) => (
          <Text key={index} style={styles.fieldLabel}>
            {field.label}:{' '}
            <Text style={[styles.fieldValue, field.valueStyle]}>
              {field.value}
            </Text>
          </Text>
        ))}
      </View>

      {/* Coluna da Direita: Ações */}
      {actions.length > 0 && (
        <View style={styles.actions}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={action.onPress}
            >
              <Icon
                name={action.iconName}
                size={action.size || 20}
                color={action.color || cores.primaria}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.primaria[10],
    borderRadius: layout.borderRadius.r25,
    padding: layout.espacamento.amigavel,
    marginVertical: layout.espacamento.texto,
    borderWidth: 1,
    borderColor: cores.borda[30],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  idText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.texto,
  },
  body: {
    flex: 1,
    gap: layout.espacamento.texto,
  },
  fieldLabel: {
    fontSize: 14,
    color: cores.texto,
  },
  fieldValue: {
    fontWeight: 'normal',
    color: cores.texto,
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: layout.espacamento.texto,
    gap: layout.espacamento.texto,
  },
  actionButton: {
    backgroundColor: cores.branco,
    borderRadius: layout.borderRadius.r100,
    padding: layout.espacamento.texto / 2,
    borderWidth: 1,
    borderColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
  },
});