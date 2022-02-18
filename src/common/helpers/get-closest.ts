

export function getClosest<T extends HTMLElement> (availableElements : NodeListOf<T>, currentElementRect : DOMRect) 
: [number, T] {
  let closestInRange : [number, T] = [undefined, undefined];
  availableElements.forEach(element => {
    const inputPos = element.getBoundingClientRect();
    const distance = Math.sqrt(
      Math.pow((currentElementRect.x + currentElementRect.width)-inputPos.x, 2) + 
      Math.pow((currentElementRect.y + currentElementRect.height/2)-inputPos.y, 2)
    )
    if(distance < 80 && (distance < closestInRange[0] || closestInRange[0] === undefined)){
      closestInRange = [distance, element];
    }
  })
  return closestInRange;
}