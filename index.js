const contractSource = `
contract Greeter =
  record state = {  // Valores claves a guardar
    greeter_oracle : oracle(string, string),
    greets         : map(address, oracle_query(string, string))}

  stateful entrypoint init() : state =  //Función de Inicio
    let greeter_oracle : oracle(string, string) = register_oracle()
    { greeter_oracle = greeter_oracle, greets = {}  }

  entrypoint get_oracle(): oracle(string, string) =  //Función consultar dirección del oráculo
    state.greeter_oracle

  entrypoint get_balance() : int =  //Función consultar balance del oráculo
    Contract.balance

  stateful entrypoint register_oracle() : oracle(string, string) =  //Función registrar el oráculo
    Oracle.register(Contract.address, 10, RelativeTTL(200))

  payable stateful entrypoint greet_oracle(message : string) : bool =  //Función pagar consulta del oráculo
    let val = Call.value
    if(val != 10)
      false
    else
      let query : oracle_query(string, string) =
        Oracle.query(state.greeter_oracle, message, 10, RelativeTTL(50), RelativeTTL(50))
      put(state{greets[Call.caller] = query })
      respond_to_greet()
      true

  entrypoint get_address(direccion : address) : oracle_query(string, string) =  //Función consulta id de consulta
    switch(Map.lookup(direccion, state.greets))
      None    => abort("No Resitrado")
      Some(x) => x

  stateful entrypoint respond_to_greet() =  //Función responder la consulta del oráculo
    let query = get_address(Call.caller)
    let greet : string = Oracle.get_question(state.greeter_oracle, query)
    let greet_is_valid : bool = greet == "Hello" || greet == "Hi" || greet == "Greetings"
    if(greet_is_valid)
      let response : string = greet
      let respuesta : string = String.concat(greet, " Friend") 
      Oracle.respond(state.greeter_oracle, query, respuesta)
    else 
       Oracle.respond(state.greeter_oracle, query, "")
 
  stateful entrypoint get_to_greet() =    //Función mostrar la respuesta del oráculo
    let query = get_address(Call.caller)
    Oracle.get_answer(state.greeter_oracle,query)

  //Funciones básicas
  
  stateful entrypoint contract_creator() = //dirección que creo el contracto
    Contract.creator

  stateful entrypoint contract_address() = //dirección del contracto
    Contract.address

  stateful entrypoint contract_balance() = //balance del contracto
    Contract.balance
`;

//Address of the  smart contract on the testnet of the aeternity blockchain
//Dirección del contrato inteligente en el testnet de la blockchain de aeternity
const contractAddress = 'ct_2qdcDW6JDAqMY6iBsNYxsYubAyD5hsxoowHUXGgheE6NSodFRz';

//Create variable for client so it can be used in different functions
//Crear la variable cliente para las funciones
var client = null;

//Create a new global array for the messages
//Crea un array para los mensajes
var mensajes = [];


//Create a asynchronous read call for our smart contract
//Cree una llamada de lectura asincrónica para uso de funciones estáticas
async function callStatic(func, args) {

	//Create a new contract instance that we can interact with
	//Cree una nueva instancia de contrato con la que podamos interactuar
	const contract = await client.getContractInstance(contractSource, {contractAddress});

	//Make a call to get data of smart contract func, with specefied arguments
	//Realice una llamada para obtener datos de funciones de contratos inteligentes, con argumentos específicos
	const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));

	//Make another call to decode the data received in first call
	//Realice otra llamada para decodificar los datos recibidos en la primera llamada
	const decodedGet = await calledGet.decode().catch(e => console.error(e));

  return decodedGet;
}

//Create a asynchronous write call for our smart contract
//Cree una llamada de escritura asincrónica para las funciones dinámicas
async function contractCall(func, args, value) {
	
	//Make a call to write smart contract func, with aeon value input
	//Realice una llamada para escribir una función de contrato inteligente, con una entrada de valor eón
	const contract = await client.getContractInstance(contractSource, {contractAddress});
	
	//Make a call to get data of smart contract func, with specefied arguments
	//Realice una llamada para obtener datos de funciones de contratos inteligentes, con argumentos específicos
	const calledSet = await contract.call(func, args, {amount: value}).catch(e => console.error(e));

	return calledSet;
}

//Execute main function
//Ejecutar función principal
window.addEventListener('load', async () => {

	//Display the loader animation so the user knows that something is happening
	//Muestra la animación de cargando....
	$("#loader").show();

	//Initialize the Aepp object through aepp-sdk.browser.js, the base app needs to be running.
	//Inicialice el objeto Aepp a través de aepp-sdk.browser.js, la aplicación base debe estar ejecutándose.
	client = await Ae.Aepp();

	//Hide loader animation
	//Oculta la animación de cargando
	$("#loader").hide();
});

//If someone clicks to consult the oracle,  execute greet_oracle
//Si alguien hace clic para consultar al oráculo, ejecute greet_oracle
$('#greetBtn').click(async function(){
	$("#loader").show();

	//Create new variable for get the values from the input fields
	//Crea nueva variables para obtener los valores de los campos de entrada.
	const string = ($('#string').val());

	//Make the contract call to consult the oracle with the newly passed values
	//Llame al contrato para consultar el oráculo con los valores recibidos
	await contractCall('greet_oracle', [string], 10);

	client = await Ae.Aepp();
	const consul = await callStatic('get_to_greet',[]);
	document.getElementById("textnotice").innerHTML = "Answer: </br>"+consul.Some[0];
	div = document.getElementById('notice');
	div.style.display = '';

	$("#loader").hide();
});

//If someone clicks register Oracle,  execute queryFee
//Si alguien hace clic para registrar oráculo, ejecute register_oracle
$('#registerOracleBtn').click(async function(){
	$("#loader").show();
	client = await Ae.Aepp();
	const adrress = ($('#adrress').val());
	await contractCall('register_oracle', [], 0);
	document.getElementById("textnotice").innerHTML = "register oracle";
	div = document.getElementById('notice');
	div.style.display = '';
	$("#loader").hide();
});
