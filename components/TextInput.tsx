import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  TextInput as RNTextInput,
} from "react-native";
import React from "react";
import { AppColors } from "@/constants/theme";

interface TextInputProps {
  id?: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCorrect = false,
  multiline = false,
  numberOfLines,
  style,
  inputStyle,
  labelStyle,
  autoCapitalize = "sentences",
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <RNTextInput
        id={id}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        label={label}
        error={error}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[
          styles.input,
          inputStyle,
          multiline && styles.multiligneInput,
          error && styles.inputError,
        ]}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </RNTextInput>
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: AppColors.text.primary,
  },
  input: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: AppColors.gray[300],
    color: AppColors.text.primary,
  },
  multiligneInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: AppColors.error,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
