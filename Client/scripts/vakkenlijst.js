import { Vak } from "./vak.js";

const localStorageKey = "vakkenLijst";

export class Vakkenlijst {
    #vakken;
    constructor() {
        this.#vakken = [];

        // Ophalen van de lijst van vakken uit de local storage.
        // Opgelet: dit kan null zijn indien de pagina een eerste keer getoond wordt.
        let vakkenLijstFromStorage = localStorage.getItem(localStorageKey);
        if (vakkenLijstFromStorage) {
            // Indien niet null: de JSON string terug omzetten naar een array van vakken.
            // Opgelet: dit zijn gewone JavaScript objecten die niet (meer) afstammen van de Vak class.
            // Vandaar loopen we over alle vakken uit de JSON en maken we terug volwaardige Vak-objecten van.
            let vakkenFromJson = JSON.parse(vakkenLijstFromStorage);
            vakkenFromJson.forEach(vakFromJson => {
                let vak = Vak.restoreFromJsonObject(this, vakFromJson);
                this.#vakken.push(vak);
            });
        }
        else {
            // Indien wel null: al direct vakken toevoegen :)
            this.#vakken.push(new Vak(this, -1, "IT essentials", 3, 0));
            this.#vakken.push(new Vak(this, -1, "IT landscape", 3, 0));
            this.#vakken.push(new Vak(this, -1, "Databases basis", 4, 0));
            this.#vakken.push(new Vak(this, -1, "Databases gevorderd", 4, 0));
            this.#vakken.push(new Vak(this, -1, "Programmeren basis", 9, 0));
            this.#vakken.push(new Vak(this, -1, "Programmeren gevorderd", 6, 0));
            this.#vakken.push(new Vak(this, -1, "Frontend basis", 7, 0));
            this.#vakken.push(new Vak(this, -1, "Frontend gevorderd", 5, 0));
            this.#vakken.push(new Vak(this, -1, "Backend 1", 4, 0));
            this.#vakken.push(new Vak(this, -1, "Verkenning van de werkplek", 4, 0));
            this.#vakken.push(new Vak(this, -1, "Communicatievaardigheden", 3, 0));
            this.#vakken.push(new Vak(this, -1, "Participatie op de werkplek 1", 6, 0));
            this.#vakken.push(new Vak(this, -1, "Teamvaardigheden", 3, 0));
            this.save();
        }
    }

    addVak(naam, studiepunten) {
        let vak = new Vak(this, -1, naam, studiepunten, 0);
        let bestaandVak = this.#vakken.filter(v => v.naam === naam);
        if (bestaandVak.length > 0) throw `Er bestaat reeds een vak met de naam ${naam}`;
        else {
            this.#vakken.push(vak);
            this.save();
            this.#renderVakken();
        }
    }

    deleteVak(id) {
        let indexToDelete = -1;
        for (let i = 0; i < this.#vakken.length; i++) {
            if (this.#vakken[i].id === id) {
                indexToDelete = i;
                break;
            }
        }
        if (indexToDelete >= 0) {
            this.#vakken.splice(indexToDelete, 1);
            this.save();
            this.#renderVakken();
        }
    }

    save() {
        localStorage.setItem(
            localStorageKey,
            JSON.stringify(this.#vakken)
        );
    }

    render(element) {
        let table =
            `<table id="vakkenlijst" class="table">
                <thead>
                    <tr>
                        <th>Vak</th>
                        <th>Studiepunten</th>
                        <th>Geschat aantal uren</th>
                        <th>Aantal uren</th>
                        <th></th> <!-- Voor de action buttons -->
                    </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                    <tr>
                        <td><button id="voegVakToe" class="btn btn-secondary">Nieuw vak</button></td>
                        <td></td>
                        <td></td>
                        <td><button id="corrigeerUren" class="btn btn-secondary">Correctie</button></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>`;

        element.innerHTML = table;

        document.getElementById("voegVakToe").addEventListener("click", (evt) => {
            this.addVak("Vak", 1);
        });

        document.getElementById("corrigeerUren").addEventListener("click", (evt) => {
            let buttons = document.querySelectorAll("#vakkenlijst input");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].removeAttribute("readonly");
            }
        });

        this.#renderVakken();
    }

    #renderVakken() {
        let tbody = document.querySelector("#vakkenlijst tbody");
        tbody.innerHTML = ""; // Indien render een zoveelste keer wordt aangeroepen: de rijen verwijderen en opnieuw aanmaken.
        for (let i = 0; i < this.#vakken.length; i++) {
            // Elke rij mag zichzelf dan 'renderen' in het HTML document.
            this.#vakken[i].render(tbody);
        }
    }
}