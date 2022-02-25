import React from 'react'
import { View, StyleSheet, Text, TextInput } from 'react-native'
import { theme } from '../core/theme'

export default function Input({ errorText, description, ...props }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 18,
  },
  input: {
    backgroundColor: 'rgba(248, 34, 34, 0.25)',
    color: theme.colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(217, 15, 200, 0.55)',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    fontFamily:'Raleway_400Regular'
      
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})
