import {Text, TouchableOpacity} from 'react-native'
import {styles} from '../styles/button.styles'

export default function Button({title, onPress}) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text styles={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}