import { LightningElement, api } from 'lwc';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RefreshCompentOnRecordUpdate extends LightningElement {
    @api recordId;

    channelName = '/event/Notification__e'; // Replace with your Platform Event API name
    subscription = null;

    connectedCallback() {
        this.subscribeToPlatformEvent();
        this.registerErrorListener();
    }

    disconnectedCallback() {
        this.unsubscribeFromPlatformEvent();
    }

    subscribeToPlatformEvent() {
        try {
            subscribe(this.channelName, -1, (message) => {
                const payload = message.data.payload;
                this.fireToast(payload.Message_c);
                setTimeout(() => {
                    notifyRecordUpdateAvailable([
                        { recordId: this.recordId }
                    ]);
                }, 1000);


            }).then((response) => {
                this.subscription = response;
                console.log('Subscribed:', response.channel);
            });
        } catch (error) {
            console.error('Error during record initialization update:', error);
        }
    }

    unsubscribeFromPlatformEvent() {
        if (this.subscription) {
            unsubscribe(this.subscription, () => {
                console.log('Unsubscribed');
            });
        }
    }

    registerErrorListener() {
        onError((error) => {
            console.error('EMP API Error:', error);
        });
    }

    fireToast(message) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: message,
                variant: 'success'
            })
        );
    }
}