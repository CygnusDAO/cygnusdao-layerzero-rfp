<h1>CygnusDAO LayerZero RFP</h1>

<h2>Instructions</h2>

1. git clone `git@github.com:CygnusDAO/cygnusdao-layerzero-rfp.git`
2. `cd ./cygnus-layerzero-rfp`
3. `npm i`
4. Create a `.env` file with the values from `.env.example`, use your own RPC endpoints for each chain (from Alchemy, Infura, etc.)
5. On the `src` folder there are 4 folders, one for lenders, borrowers, stakers and community members. To create the .csv for each just run the .js file (ie. `node lenders.js`) and it will export all depositor addresses along with their deposited amount, denominated in USD.

Step 4 will export the .csv's we used for the `RAW_DATA` tabs [here](https://docs.google.com/spreadsheets/d/1ivoFcfQkmtH0F_KufZ-cNMSLPr58-L1HbsI9wyBHay8/edit?usp=sharing).
