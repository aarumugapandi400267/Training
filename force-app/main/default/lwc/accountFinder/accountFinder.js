import { LightningElement, wire, track } from 'lwc';
import queryAccountsByRevenue from '@salesforce/apex/AccountListControllerLwc.queryAccountsByRevenue';

export default class AccountFinder extends LightningElement {
    accountId;
    name;
    onNameChange(event) {
        this.name = event.target.value;
    }
    createAccount() {
        const recordInput = {
            apiName: ACCOUNT_OBJECT.objectApiName,
            fields: { 
                [NAME_FIELD.fieldApiName]: this.name, 
            }
        };
        createRecord(recordInput)
            .then(account => {
                this.accountId = account.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account created',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                // Handle error. Details in error.message.
            });
    }
    @track annualRevenue = null; 
    @track accounts; 

    @wire(queryAccountsByRevenue, { annualRevenue: '$annualRevenue' })
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            this.accounts = undefined;
            console.error(error);
        }
    }

    handleChange(event) {
        this.annualRevenue = event.target.value;
        // this.annualRevenue = event.target.value;
    }

    reset() {
        this.annualRevenue = null;
    }
}
