
import content from 'common/script/content';

const specialPets = Object.keys(content.specialPets);
const premiumPets = Object.keys(content.premiumPets);
const questPets = Object.keys(content.questPets);
const dropPets = Object.keys(content.pets);

function getText (textOrFunction) {
  if (textOrFunction instanceof Function) {
    return textOrFunction();
  } else {
    return textOrFunction;
  }
}

export function isOwned (type, animal, userItems) {
  return userItems[`${type}s`][animal.key] > 0;
}

export function isHatchable (animal, userItems) {
  return !isOwned('pet', animal, userItems) &&
    userItems.eggs[animal.eggKey] &&
    userItems.hatchingPotions[animal.potionKey];
}

export function isAllowedToFeed (animal, userItems) {
  return !specialPets.includes(animal.key) &&
    isOwned('pet', animal, userItems) &&
    !isOwned('mount', animal, userItems);
}

export function isSpecial (animal) {
  return specialPets.includes(animal.key);
}

export function createAnimal (egg, potion, type, _content, userItems) {
  let animalKey = `${egg.key}-${potion.key}`;
  let fooledKey = '';
  if (questPets.includes(animalKey)) {
    fooledKey = 'Fox-Veggie';
  } else if (dropPets.includes(animalKey) || premiumPets.includes(animalKey)) {
    fooledKey = `${egg.key}-Veggie`;
  } else {
    fooledKey = animalKey;
  }

  return {
    key: animalKey,
    class: type === 'pet' ? `Pet Pet-${fooledKey}` : `Mount_Icon_${animalKey}`,
    eggKey: egg.key,
    eggName: getText(egg.text),
    potionKey: potion.key,
    potionName: getText(potion.text),
    name: _content[`${type}Info`][animalKey].text(),
    isOwned () {
      return isOwned(type, this, userItems);
    },
    mountOwned () {
      return isOwned('mount', this, userItems);
    },
    isAllowedToFeed () {
      return isAllowedToFeed(this, userItems);
    },
    isHatchable () {
      return isHatchable(this, userItems);
    },
    isSpecial () {
      return isSpecial(this);
    },
  };
}
