'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * AddNewCard transaction processor function.
 * @param {org.dek.network.AddUser} tx The sample transaction instance.
 * @transaction
 */

async function addUser(tx) { // eslint-disable-line no-unused-vars

  let factory = getFactory();
  const networkName = 'org.dek.network';
  const fullNetworkName = networkName + '.User';
  let createdUser = factory.newResource(networkName, 'User', tx.userId);
  createdUser.citizenId = tx.citizenId;
  createdUser.firstname = tx.firstname;
  createdUser.lastname = tx.lastname;

  const assetRegistry = await getAssetRegistry(fullNetworkName);
  await assetRegistry.add(createdUser);

}

/**
 * AddRoyaltyProgram transaction processor function.
 * @param {org.dek.network.AddRoyaltyProgram} tx The sample transaction instance.
 * @transaction
 */
async function addRoyaltyProgram(tx) { // eslint-disable-line no-unused-vars

  let factory = getFactory();
  const networkName = 'org.dek.network';
  const fullNetworkName = networkName + '.RoyaltyProgram';
  let createdRoyaltyProgram = factory.newResource(networkName, 'RoyaltyProgram', tx.royaltyProgramId);
  createdRoyaltyProgram.royaltyProgramName = tx.royaltyProgramName;
  createdRoyaltyProgram.vendorName = tx.vendorName;

  const assetRegistry = await getAssetRegistry(fullNetworkName);
  await assetRegistry.add(createdRoyaltyProgram);

}

/**
 * AddCard transaction processor function.
 * @param {org.dek.network.AddCard} tx The sample transaction instance.
 * @transaction
 */
async function addCard(tx) { // eslint-disable-line no-unused-vars

  let factory = getFactory();
  const networkName = 'org.dek.network';
  const fullNetworkName = networkName + '.Card';
  let createdCard = factory.newResource(networkName, 'Card', tx.cardId);
  createdCard.userId = tx.userId;
  createdCard.cardNumber = tx.cardNumber;
  createdCard.point = tx.point;
  createdCard.royaltyProgramId = tx.royaltyProgramId;

  const assetRegistry = await getAssetRegistry(fullNetworkName);
  await assetRegistry.add(createdCard);

}

/**
 * TransferPoint transaction processor function.
 * @param {org.dek.network.TransferPoint} tx The sample transaction instance.
 * @transaction
 */
async function transferPoint(tx) { // eslint-disable-line no-unused-vars

  let fullNetworkName = 'org.dek.network.Card';
  let networkName = 'org.dek.network';

  const assetRegistry = await getAssetRegistry(fullNetworkName);

  let oldCard = await assetRegistry.get(tx.fromCardId);
  let newCard = await assetRegistry.get(tx.toCardId);

  if (parseInt(oldCard.point) < parseInt(tx.fromPoint)) {
    return Promise.reject('Point not enough to transfer');
  }

  const oldPoint = oldCard.point;
  const oldCardId = oldCard.cardId;
  const oldCardRoyaltyProgramId = oldCard.royaltyProgramId;

  oldCard.point = (parseInt(oldCard.point) - parseInt(tx.fromPoint)).toString();
  newCard.point = (parseInt(newCard.point) + parseInt(tx.toPoint)).toString();

  const newCardId = newCard.cardId;
  const newPoint = newCard.point;
  const newCardRoyaltyProgramId = newCard.royaltyProgramId;

  await assetRegistry.update(oldCard);
  await assetRegistry.update(newCard);

  let event = getFactory().newEvent(networkName, 'CardHistory');
  event.userId = tx.userId;
  event.oldPoint = oldPoint;
  event.oldCardId = oldCardId;
  event.oldCardRoyaltyProgramId = oldCardRoyaltyProgramId;
  event.newCardId = newCardId;
  event.newPoint = newPoint;
  event.newCardRoyaltyProgramId = newCardRoyaltyProgramId;
  emit(event);
  return Promise.resolve(event);
}