import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'



const Button = ({
    title, 
    type,
}: {
    title: string; 
    type: 'top' | 'right' | 'number';
}) => {
    return (
        <TouchableOpacity style={styles.button}
        
         onPress={() => {}}>
            <Text style={{fontSize: 34, color: 'black'}}> {title} </Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        height: 70,
        width: 70,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey'
    }
})

