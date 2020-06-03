## Functions description Greetins
******************************
## Call Static Function
******************************
```sh
get_oracle	--> Consulta dirección del oráculo
get_balance 	--> Obtiene el balance del oráculo.argumentos [OracleAddress : string]
queryFee	--> Obtiene pago mínimo para una consulta del oráculo.argumentos [OracleAddress : string]
get_to_greet	--> Consulta la pregunta que le hicieron al orácula según id. argumentos [OracleAddress : string, OracleID : string]
respond_to_greet--> Muestra la respuesta a una pregunta. argumentos [OracleAddress : string, OracleID : string]
```
******************************
## Call Function
******************************
```sh
register_oracle	--> Función para Registrar el Oraculo. argumentos [qfee : int,  rttl : int]
get_address	--> Obtiene el ID de consulta del oraculo. argumentos [OracleAddress : string]
```
******************************
## General-Purpose functions
******************************
```sh
contract_creator--> obtiene la dirección con la que se creo el contrato
contract_address--> obtiene la dirección del contrato
contract_balance--> obtiene el balance del oraculo
```
******************************
## Key used for compilation and deploy of the contract
******************************
```sh
public key : ak_2nniXZjP6vVDZCSpwkvXjbzCqKqHrXKQgv4ug2VnurumNE1Gfk
private key: f9f43aa1d70f59a1dd854d1ac51837d2b2b67f61cbc9b1eef276eab40147e6e8eba9f018046338e2a873dc3d0cdb75cc087906198fe629f9d9a1712f3ddf2d3b
```
