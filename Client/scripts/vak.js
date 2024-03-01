let nextId = 0;

export class Vak {
    static restoreFromJsonObject(vakkenlijst, jsonObject) {
        // de id-teller op het maximaal 'tegengekomen' id zetten zodat er geen id-clashes ontstaan bij toevoegen van nieuwe vakken.
        nextId = Math.max(nextId, jsonObject.id + 1);

        // En het 'vak' object aanmaken op basis van de settings in het vak uit de JSON.
        let vak = new Vak(vakkenlijst, jsonObject.id, jsonObject.naam, jsonObject.studiepunten, jsonObject.aantalUren);
        return vak;
    }

    #vakkenlijst;

    #id;
    #naam;
    #studiepunten;
    #aantalUren;

    constructor(vakkenlijst, id, naam, studiepunten, aantalUren) {
        this.#vakkenlijst = vakkenlijst;

        if (id === null || id === undefined || id < 0) {
            this.#id = nextId++;
        } else {
            this.#id = id;
        }
        this.#naam = naam;
        this.#studiepunten = studiepunten;
        this.#aantalUren = aantalUren;
    }

    // Primaire (technische) sleutel van een vak.
    // Blijft ongewijzigd, zelfs bij wijzigingen van de naam van het vak.
    get id() {
        return this.#id;
    }

    get naam() {
        return this.#naam;
    }

    set naam(val) {
        if (!val) {
            throw "Een vaknaam moet minstens uit één teken bestaan";
        }
        this.#naam = val;
    }

    get studiepunten() {
        return this.#studiepunten;
    }

    set studiepunten(val) {
        if (isNaN(val) || val < 1) {
            throw "Gelieve een getal groter dan 0 op te geven";
        }
        this.#studiepunten = val;
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

        // Na het aanpassen van de uren direct ook weer saven...
        this.#vakkenlijst.save();
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
                    <button>x</button>
                </td>
            </tr>`;

        // innerHTML gebruiken is gevaarlijk: want de tweede keer dat je een rij toevoegt zal de HTML content vervangen worden waardoor
        // alle event handlers weggegooid worden...
        tbody.insertAdjacentHTML('beforeend', tr);

        let naamInput = document.querySelector(`#vak-${this.id} input[name='naam']`);
        naamInput.addEventListener("change", (evt) => {
            try {
                this.#resetError(naamInput);

                this.naam = evt.target.value;
                this.#vakkenlijst.save();
            } catch (ex) {
                this.#setError(naamInput, ex);
            }
        });

        let studiepuntenInput = document.querySelector(`#vak-${this.id} input[name='studiepunten']`);
        let geschatAantalUrenSpan = document.querySelector(`#vak-${this.id} span`);
        studiepuntenInput.addEventListener("change", (evt) => {
            try {
                this.#resetError(studiepuntenInput);

                this.studiepunten = evt.target.value;
                this.#geefFeedbackBijOverschrijding();
                geschatAantalUrenSpan.innerText = this.geschatAantalUren;
                this.#vakkenlijst.save();
            } catch (ex) {
                this.#setError(studiepuntenInput, ex);
            }
        });


        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name='aantalUren']`);
        aantalUrenInput.addEventListener("change", (evt) => {
            try {
                this.#resetError(aantalUrenInput);

                this.aantalUren = evt.target.value;
                this.#geefFeedbackBijOverschrijding();
            } catch (ex) {
                aantalUrenInput.value = this.aantalUren;
                this.#setError(aantalUrenInput, ex);
            }            
        });

        let verhoogAantalUrenButton = document.querySelector(`#vak-${this.id} > td:last-child > button:first-child`);
        verhoogAantalUrenButton.addEventListener("click", (evt) => {
            this.aantalUren++;
            aantalUrenInput.value = this.aantalUren;
            this.#geefFeedbackBijOverschrijding();
        });

        let deleteButton = document.querySelector(`#vak-${this.id} > td:last-child > button:last-child`);
        deleteButton.addEventListener("click", (evt) => {
            this.#vakkenlijst.deleteVak(this.id);
        });

        // En ook al direct een eerste keer aanroepen (want het zou kunnen dat het aantal uren al groter is dan het geschat aantal uren).
        this.#geefFeedbackBijOverschrijding();
    }

    // Als een object toJSON() implementeert zal de JSON.stringify() deze methode aanroepen/
    // Zo heb je zelf controle over wat er wordt geserialiseerd want
    // 1) We willen de private variabelen serialiseren (private variabelen worden standaard niet geserialiseerd)
    // 2) Bepaalde variabelen willen we niet serialiseren (zoals #vakkenlijst) want dat zou een circulaire serialisatie veroorzaken.
    toJSON() {
        return {
            id: this.#id,
            naam: this.#naam,
            studiepunten: this.#studiepunten,
            aantalUren: this.#aantalUren
        };
    }

    #geefFeedbackBijOverschrijding() {
        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name='aantalUren']`);
        if (this.aantalUren > this.geschatAantalUren) {
            aantalUrenInput.style.backgroundColor = "orange";
        } else {
            aantalUrenInput.style.backgroundColor = "unset";
        }
    }

    #resetError(input) {
        input.setAttribute('title', '');
        input.style.backgroundColor = "unset";
    }

    #setError(input, message) {
        input.setAttribute('title', message);
        input.style.backgroundColor = "red";
    }
}