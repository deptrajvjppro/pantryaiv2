
import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const defaultStyle = StyleSheet.create({  
    container:{
        flex: 1,
        backgroundColor:'#f0f'
    },
    inputBox: {
        height: 50,
        width: 350,
        left :20,
        borderWidth: 1,
        borderColor: 'black', 
        borderRadius: 7,
        padding: 5,
        paddingLeft: 20,
        fontFamily: 'mon'
        
    },
    loginButton:{
        height: 50,
        width: 350,
        left :20,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        borderRadius: 7,
        
        
    },
    buttonText:{

    },

})