/*******************************************************************************************************
 * Keyboard and Mouse Disable Functions file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 20/10/2021 Ojas Telwane	Created 
 *******************************************************************************************************/

export function disableRightClick() {
  document.addEventListener('contextmenu', event => event.preventDefault());
}
