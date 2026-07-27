import { LightningElement, api } from 'lwc';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import { RefreshEvent } from 'lightning/refresh';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class RefreshCmpWithPlatformEvent extends LightningElement {
    @api recordId;

    channelName = '/event/Notification__e'; // Your Platform Event API Name
    subscription = null;

    connectedCallback() {
        this.subscribeToPlatformEvent();
        this.registerErrorListener();
    }

    disconnectedCallback() {
        this.unsubscribeFromPlatformEvent();
    }

    subscribeToPlatformEvent() {
        subscribe(this.channelName, -1, (message) => {
            const payload = message.data.payload;
            setTimeout(() => {
                this.dispatchEvent(new RefreshEvent());
                this.fireToast(payload.Message__c);

            },1000);

        }).then((response) => {
            this.subscription = response;
        });
    }

    unsubscribeFromPlatformEvent() {
        if (this.subscription) {
            unsubscribe(this.subscription, () => { });
        }
    }

    registerErrorListener() {
        onError(error => {
            console.error('EMP API Error', error);
        });
    }
    fireToast(msg) {
        const event = new ShowToastEvent({
            title: "Get Help",
            message: msg,
        });
        this.dispatchEvent(event);
    }

}