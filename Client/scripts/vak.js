export class Vak {
    static restoreFromJsonObject(jsonObject) {
        // Het 'vak' object aanmaken op basis van de settings in het vak uit de JSON.
        let vak = new Vak(jsonObject.id, jsonObject.naam, jsonObject.studiepunten, jsonObject.aantalUren);
        return vak;
    }

    #id;
    #naam;
    #studiepunten;
    #aantalUren;

    constructor(id, naam, studiepunten, aantalUren) {
        this.#id = id;
        this.#naam = naam;
        this.#studiepunten = studiepunten;
        this.#aantalUren = aantalUren;
    }

    // Primaire (technische) sleutel van een vak.
    get id() {
        return this.#id;
    }

    get naam() {
        return this.#naam;
    }

    get studiepunten() {
        return this.#studiepunten;
    }

    // Het geschat aantal uren is een 'berekende' property.
    // Deze heeft dus geen 'setter'.
    get geschatAantalUren() {
        return this.#studiepunten * 30;
    }

    get aantalUren() {
        return this.#aantalUren;
    }

    set aantalUren(val) {
        if (isNaN(val) || val < 0) {
            throw "Gelieve een getal groter dan of gelijk aan 0 op te geven";
        }
        this.#aantalUren = val;
    }

    render(tbody) {
        let tr =
            `<tr id="vak-${this.id}">
                <td><input name="naam" type="text" value="${this.naam}" /></td>
                <td><input name="studiepunten" type="number" value="${this.studiepunten}" min="1" /></td>
                <td><span>${this.geschatAantalUren}</span></td>
                <td><input name="aantalUren" type="number" value="${this.aantalUren}" min="0" readonly /></td>
                <td>
                    <button>+</button>
                </td>
            </tr>`;

        // innerHTML gebruiken is gevaarlijk: want de tweede keer dat je een rij toevoegt zal de HTML content vervangen worden waardoor
        // alle event handlers weggegooid worden... Vandaar gebruik van insertAdjacentHTML.
        tbody.insertAdjacentHTML('beforeend', tr);

        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name='aantalUren']`);
        // selecteren van de '+' button. In principe kunnen er nog buttons bijkomen (vb. een delete button). Vandaar: first-child.
        let verhoogAantalUrenButton = document.querySelector(`#vak-${this.id} > td:last-child > button:first-child`);
        verhoogAantalUrenButton.addEventListener("click", (evt) => {
            this.aantalUren++;
            aantalUrenInput.value = this.aantalUren;
        });
    }

    // Als een object toJSON() implementeert zal de JSON.stringify() deze methode aanroepen.
    // Zo heb je zelf controle over wat er wordt geserialiseerd want
    // 1) We willen de private variabelen serialiseren (private variabelen worden standaard niet geserialiseerd)
    toJSON() {
        return {
            id: this.#id,
            naam: this.#naam,
            studiepunten: this.#studiepunten,
            aantalUren: this.#aantalUren
        };
    }
}
