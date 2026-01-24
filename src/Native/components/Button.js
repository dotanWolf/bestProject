import {Text, TouchableOpacity} from 'react-native'
import {styles} from '../styles/button.styles'

export default function Button({title, onPress, style}) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text styles={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}