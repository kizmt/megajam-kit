# Using In-App Purchases

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices?application_version=5.9

> Using in-app purchases to offer additional paid content for your game.

[image: Using In-App Purchases]

In-app purchases enable you to offer additional content and features to users. You can use this as a means to monetize a free application or to provide additional paid content for your application.

## General Mobile Stores Information

Some information here is summarized. Refer to the Google Play Billing Library documentation or the Apple StoreKit documentation for more information. Some additional details are provided for each platform on their respective pages:

- [image: Using In-App Purchases on Android] Using In-App Purchases on AndroidUsing in-app purchases to offer additional paid content for your Android game. (-> how-to-use-inapp-purchases-in-unreal-engine-projects-on-android)

- [image: Using In-App Purchases on iOS] Using In-App Purchases on iOSUsing in-app purchases to offer additional paid content for your iOS game. (-> how-to-use-inapp-purchases-in-unreal-engine-projects-on-ios)

The regular flow for using in-app purchases on mobile stores is:

- Query product details to the store.Products in the store are identified by product IDs, which are string based identifiers you previously assigned when configuring in-app purchase products for your application in the store.
- This step provides updated store information (like pricing and localized descriptions) and makes the product available to purchase. Underlying libraries use some low-level objects retrieved from this step to be able to initiate a purchase

- Initiate a purchase for a given product IDThis shows a native UI to complete the payment using the store's payment services on the device. After a successful payment, a receipt is generated representing the transaction.

- Validate the transactionYou must validate the transaction is legitimate to avoid fraud. Stores provide and recommend using server-to-server calls with their servers to verify legitimate transactions and retrieve additional information about the purchased product (like expiration times for subscriptions). This is accomplished by sending the receipt information to your servers and verifying them server-side.

- Grant productGrant and persist the in-game product the user acquired after successfully validating the transaction.

- Finalize the transactionStores expect the transaction to be marked as completed after the in-game product is granted. Not properly finalizing the transaction might lead to refunds on Google Play and performance issues on App Store.
- You must store that a given purchase was already completed by a given user to avoid granting the product multiple times for the same transaction.
- Applications should not finalize transactions if the receipt could not be validated or the content could not be granted by the backend. Unfinalized receipts should result in retries or refunds if it was not possible to safely grant the product.

Payments can be deferred because they need additional steps to complete. Examples of this include:

- Payments expected to be completed with cash in a physical store.
- Showing agreements because legal terms changed.
- Parental control that requires an adult to accept the purchase.

Underlying libraries notify you asynchronously when those payments become successful if the application is running, so you can get the new receipts and complete the purchase flow. If the application is not running the receipts will be available on next execution

Due to mobile devices particularities, any step from the purchase flow may be interrupted by unexpected reasons like network connectivity, a crash, or the user killing the application in the middle of any step. It is a good practice to check for existing receipts on startup and complete the missing steps to avoid double granting products.

Google Play and App Store differ on which information is available regarding a purchase once it has been finalized but both of them expose receipts for not finalized transactions. They also behave differently with receipts related to subscription renewal.

Stores differentiate between in-app products and subscriptions:

- In-app products may be consumable or non-consumable.Consumable products can be purchased again after the transaction is completed, so users can purchase them several times. An example of those is purchasing in-game currency chests. Once the user is granted the in-game currency and the transaction is finalized the product can be purchased again.
- Non-consumable products can be purchased only once and after that point the user owns them. An example of those is unlocking a premium feature.

- Subscriptions are meant to grant some kind of benefit for a period of time.They are allowed to renew automatically so they become a recurrent source of payments. Dripping resources over time or temporary access to premium content could be an example of a subscription.
- Subscriptions allow for different renewal plans and allow offers to be configured from the stores (like free trials, discounts on initial renewals, discounts for new subscribers, and so on).

## Implementation Examples

### Query Product Details

Using the **Read In App purchase Information2** blueprint.

 Blueprint example of querying for product information and adding the known product IDs to a combo box.

 C++

```
// null checks ommited for simplicity

FUniqueNetIdRepl PlayerNetId = ...;
TArray<FString>& ProductIDs = ...;

IOnlineSubsystem* OnlineSub = IOnlineSubsystem::Get();
IOnlineStoreV2Ptr StoreInterface = OnlineSub->GetStoreV2Interface();

StoreInterface->QueryOffersById(*PlayerNetId,
                                ProductIDs,
```

### Initiating a Purchase Using a Given Product ID

You can start the purchase flow by using the **Start an in-App Purchase** blueprint.

 Example of starting an in-app purchase for the given Product ID and breaking the receipt data.

 C++

```
// null checks ommited for simplicity

FUniqueNetIdRepl PlayerNetId = ...;
TArray<FString>& ProductIDs = ...;

IOnlineSubsystem* OnlineSub = IOnlineSubsystem::Get();
IOnlinePurchasePtr PurchaseInterface = OnlineSub->GetPurchaseInterface();

FPurchaseCheckoutRequest CheckoutRequest;
```

### Final Purchase Flow Steps

 Complete flow example with blueprints. Validate Purchase and Grant Product is a node that should be provided by the game since this has business logic details.

 C++

```
// null checks ommited for simplicity

FUniqueNetIdRepl PlayerNetId = ...;
const TSharedRef<FPurchaseReceipt>& Receipt = ...

// Games should provide a way to validate the receipt using the ValidationInfo field in FPurchaseReceipt

...

// Games should provide a way to grant and persist the purchased product only once
```

### Querying and Completing Unfinished Transactions

 Full blueprint example requesting owned products.Validate Purchase and Grant Product is a node that should be provided by the game since this has business logic details.

 C++

```
// null checks ommited for simplicity
FUniqueNetIdRepl PlayerNetId = ...;

IOnlineSubsystem* OnlineSub = IOnlineSubsystem::Get();
IOnlinePurchasePtr PurchaseInterface = OnlineSub->GetPurchaseInterface();

PurchaseInterface->QueryReceipts(*PlayerNetId,
                                 false,
                                 FOnQueryReceiptsComplete::CreateLambda([PlayerNetId](const FOnlineError& Result) {
    if (Result.WasSuccessful())
```

### Handling Asynchronous Transaction Notifications

In some cases, a transaction might complete some time after it is initially notified with an error. This can happen when being marked as deferred or if some agreement needs to be accepted before continuing with the transactions. Purchases made out of the app can also be notified using this method (like enabling a subscription from outside the application). Subscription expiration and failed deferred transactions are not notified on device in any way.

To detect when an asynchronous result arrived, you can register to the `OnUnexpectedPurchaseReceipt` delegate in
`IOnlinePurchase`.

 C++

```
// null checks ommited for simplicity

IOnlineSubsystem* OnlineSub = IOnlineSubsystem::Get();
IOnlinePurchasePtr PurchaseInterface = OnlineSub->GetPurchaseInterface();

DelegateHandle = PurchaseInterface->AddOnUnexpectedPurchaseReceiptDelegate_Handle(FOnUnexpectedPurchaseReceiptDelegate::CreateLambda([](const FUniqueNetId& UserId)
{
    // Query receipts and handle new transactions or mark it to do later
});
```

// null checks ommited for simplicity

IOnlineSubsystem* OnlineSub = IOnlineSubsystem::Get();
IOnlinePurchasePtr PurchaseInterface = OnlineSub->GetPurchaseInterface();

DelegateHandle = PurchaseInterface->AddOnUnexpectedPurchaseReceiptDelegate_Handle(FOnUnexpectedPurchaseReceiptDelegate::CreateLambda([](const FUniqueNetId& UserId)
{
 // Query receipts and handle new transactions or mark it to do later
});

### Subscription Handling

Most of the information regarding status and expiration times is not available on device. Subscriptions status checks are managed server-side using the APIs and services provided by each store.

## Blueprint Nodes Descriptions

### Read In App Purchase Information2

Triggers an asynchronous query to the store to retrieve information about a list of products.

| Item | Description |
| --- | --- |
| Input Pins |  |
| **(Unlabeled)** | This execution input triggers the query for product information to the store. |
| **Player Controller** | Player controller identifying the user communicating with the store. |
| **Product Identifiers** | Array of strings that identify the product IDs you are interesting in retrieving data about. |
| Output Pins |  |
| **(Unlabeled)** | Execution output that triggers execution of the next node. |
| **On Success** | Execution output that triggers when the query succeeds. |
| **On Failure** | Execution output that triggers when the query fails. |
| **In App Offer Information** | Array of `OnlineProxyStoreOffer` containing the product information for all existing products the query was able to retrieve. |

### Start an In-App Purchase

Starts the payment flow to purchase a given product using its product ID. On success it provides a receipt identifying the transaction

| Item | Description |
| --- | --- |
| Input Pins |  |
| **(Unlabeled)** | This execution input triggers the start of the purchase flow. |
| **Player Controller** | Player controller identifying the user communicating with the store. |
| **Product request** | Request object to set the product ID. Can be created from a string. |
| Output Pins |  |
| **(Unlabeled)** | Execution output that triggers execution of the next node. |
| **OnSuccess** | Execution output that triggers when the query succeeds. |
| **OnFailure** | Execution output that triggers when the query fails. |
| **Purchase Status** | In the case of a failure, used to get the cause of the failure. |
| **In App Offer Receipt** | Receipt object generated for the given purchase. In the case of a successful purchase, data contained in the receipt can be used to verify the transaction is legitimate against the store servers. |

### Query for Owned In-App Products

Queries the store for known transactions and generates receipts for them. Received information might refer to new transactions and/or persistent ones depending on the platform. Take care to not grant products twice to users.

| Item | Description |
| --- | --- |
| Input Pins |  |
| **(Unlabeled)** | This execution input triggers the query for transaction information to the store. |
| **Player Controller** | Player controller identifying to identify the user communicating with the store |
| Output Pins |  |
| **(Unlabeled)** | Execution output that triggers execution of the next node. |
| **OnSuccess** | Execution output that triggers when the query succeeds. |
| **OnFailure** | Execution output that triggers when the query fails. |
| **Purchase Status** | In the case of a failure, used to get the cause of the failure. |
| **In App Offer Receipts** | Array of receipt objects generated from known transactions. Some of them may be new and others could be persistent depending on the platform, see the platform-specific pages for more. |

### Get known In-App Receipts

Gets cached receipts for transactions. This cache is filled after a successful execution of the `Query for Owned In-App Products` node. This node does not trigger a query.

| Item | Description |
| --- | --- |
| Input Pins |  |
| (Unlabeled) | This execution input triggers the start of the operation. |
| Player Controller | Player controller identifying to identify the user communicating with the store |
| Output Pins |  |
| (Unlabeled) | Execution output that triggers execution of the next node |
| OnSuccess | Execution output that triggers when the query succeeds. |
| OnFailure | Execution output that triggers when the operation fails. |
| Purchase Status | In the case of a failure, used to get the cause of the failure. |
| In App Offer Receipts | Array of receipt objects from cached data. |

### Finalize In-App Purchase Transaction

Finalizes the transaction identified by the input receipt. Not finalizing transactions can lead to refunds or bad device performance depending on the configuration and platform. See the Google Play and App Store documentation for more details.

| Item | Description |
| --- | --- |
| Input Pins |  |
| **(Unlabeled)** | This execution input triggers the start of the operation. |
| **In App Purchase Receipt** | Receipt identifying the transaction to be finalized. |
| **Player Controller** | Player controller identifying the user communicating with the store. |
| Output Pins |  |
| **(Unlabeled)** | Execution output that triggers execution of the next node. |

### Restore Owned In-App Products

Queries the store to restore and generate receipts for already-completed transactions. This node usefulness is platform-dependent and will not restore consumable transactions.

| Item | Description |
| --- | --- |
| Input Pins |  |
| **(Unlabeled)** | This execution input triggers the start of the operation. |
| **Player Controller** | Player controller identifying the user communicating with the store. |
| Output Pins |  |
| **(Unlabeled)** | Execution output that triggers execution of the next node. |
| **OnSuccess** | Execution output that triggers when the query operation succeeds. |
| **OnFailure** | Execution output that triggers when the operation fails. |
| **Purchase Status** | In the case of a failure, used to get the cause of the failure. |
| **In App Offer Receipts** | Array of receipt objects created from restored transactions and existing transactions. Receipts for transactions marked as Restored do not need to be explicitly finalized. |

### Troubleshoot

- Set banking data in the Google Play Console and App Store Connect connect accounts and accept all legal agreements (the Paid Apps Legal Agreement is particularly important for App Store Connect). Otherwise you might find different issues potentially not triggering any specific error and won’t be able to use sandbox environments.You cannot configure in-app/subscriptions products on the Google Play Console. The option does not appear.
- No product information from existing products is received when using **Read In App Purchase Information2** Blueprint node or `IStoreInterface::QueryOffersById` in the Sandbox environment on iOSThis is because it is possible you won’t be getting a valid net ID on iOS devices so you won’t be able to start a purchase.

- In order to run server to server calls you might need additional configuration from Google Play Cloud services (enabling APIs, OAuth credentials, service accounts) . Check Google’s documentation to set up the environment.
- If you have issues identifying with GameCenter be sure to enable it in your app App Store Connect services section and to add at least one leaderboard to it.
- Check you are using a provisioning profile with the AppID matching your application bundle ID and including the InApp Purchases entitlement on iOS.

- mobile
- in-app purchase
- services
- platform delivery

On this page

- General Mobile Stores Information (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Implementation Examples (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Query Product Details (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Initiating a Purchase Using a Given Product ID (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Final Purchase Flow Steps (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Querying and Completing Unfinished Transactions (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Handling Asynchronous Transaction Notifications (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Subscription Handling (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Blueprint Nodes Descriptions (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Read In App Purchase Information2 (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Start an In-App Purchase (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Query for Owned In-App Products (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Get known In-App Receipts (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Finalize In-App Purchase Transaction (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Restore Owned In-App Products (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- Troubleshoot (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
