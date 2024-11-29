'use client';
import React, { useEffect, useState } from "react";
import Information from "../layout/info";
import Swal from "sweetalert2";
import { checkAuth } from "@/app/auth/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaby, faCalendarAlt, faChild, faLocationDot, faPlus, faQrcode, faUserTie, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

const Tourist = () => {
    const countries = [
        { countryid: "1", countryname: "Afghanistan", regionid: "1", airline: "Kam Air" },
        { countryid: "2", countryname: "Armenia", regionid: "1", airline: "Armenia Aircompany" },
        { countryid: "3", countryname: "Azerbaijan", regionid: "1", airline: "Azerbaijan Airlines" },
        { countryid: "4", countryname: "Bahrain", regionid: "1", airline: "Gulf Air" },
        { countryid: "5", countryname: "Bangladesh", regionid: "1", airline: "Biman Bangladesh Airlines" },
        { countryid: "6", countryname: "Bhutan", regionid: "1", airline: "Druk Air" },
        { countryid: "7", countryname: "Brunei", regionid: "1", airline: "Royal Brunei Airlines" },
        { countryid: "8", countryname: "Cambodia", regionid: "1", airline: "Cambodia Angkor Air" },
        { countryid: "9", countryname: "China", regionid: "1", airline: "China Eastern Airlines" },
        { countryid: "10", countryname: "Cyprus", regionid: "1", airline: "Cyprus Airways" },
        { countryid: "11", countryname: "Georgia", regionid: "1", airline: "Georgian Airways" },
        { countryid: "12", countryname: "India", regionid: "1", airline: "Air India" },
        { countryid: "13", countryname: "Indonesia", regionid: "1", airline: "Garuda Indonesia" },
        { countryid: "14", countryname: "Iran", regionid: "1", airline: "Iran Air" },
        { countryid: "15", countryname: "Iraq", regionid: "1", airline: "Iraqi Airways" },
        { countryid: "16", countryname: "Israel", regionid: "1", airline: "El Al" },
        { countryid: "17", countryname: "Japan", regionid: "1", airline: "Japan Airlines" },
        { countryid: "18", countryname: "Jordan", regionid: "1", airline: "Royal Jordanian" },
        { countryid: "19", countryname: "Kazakhstan", regionid: "1", airline: "Air Astana" },
        { countryid: "20", countryname: "Kuwait", regionid: "1", airline: "Kuwait Airways" },
        { countryid: "21", countryname: "Kyrgyzstan", regionid: "1", airline: "Air Kyrgyzstan" },
        { countryid: "22", countryname: "Laos", regionid: "1", airline: "Lao Airlines" },
        { countryid: "23", countryname: "Lebanon", regionid: "1", airline: "Middle East Airlines" },
        { countryid: "24", countryname: "Malaysia", regionid: "1", airline: "Malaysia Airlines" },
        { countryid: "25", countryname: "Maldives", regionid: "1", airline: "Maldivian" },
        { countryid: "26", countryname: "Mongolia", regionid: "1", airline: "MIAT Mongolian Airlines" },
        { countryid: "27", countryname: "Myanmar", regionid: "1", airline: "Myanmar Airways International" },
        { countryid: "28", countryname: "Nepal", regionid: "1", airline: "Nepal Airlines" },
        { countryid: "29", countryname: "North Korea", regionid: "1", airline: "Air Koryo" },
        { countryid: "30", countryname: "Oman", regionid: "1", airline: "Oman Air" },
        { countryid: "31", countryname: "Pakistan", regionid: "1", airline: "Pakistan International Airlines" },
        { countryid: "32", countryname: "Palestine", regionid: "1", airline: "Palestine Airlines" },
        { countryid: "33", countryname: "Philippines", regionid: "1", airline: "Philippine Airlines" },
        { countryid: "34", countryname: "Qatar", regionid: "1", airline: "Qatar Airways" },
        { countryid: "35", countryname: "Saudi Arabia", regionid: "1", airline: "Saudia" },
        { countryid: "36", countryname: "Singapore", regionid: "1", airline: "Singapore Airlines" },
        { countryid: "37", countryname: "South Korea", regionid: "1", airline: "Korean Air" },
        { countryid: "38", countryname: "Sri Lanka", regionid: "1", airline: "SriLankan Airlines" },
        { countryid: "39", countryname: "Syria", regionid: "1", airline: "Syrian Air" },
        { countryid: "40", countryname: "Taiwan", regionid: "1", airline: "China Airlines" },
        { countryid: "41", countryname: "Tajikistan", regionid: "1", airline: "Tajik Air" },
        { countryid: "42", countryname: "Thailand", regionid: "1", airline: "Thai Airways" },
        { countryid: "43", countryname: "Timor-Leste", regionid: "1", airline: "TAP Air Portugal" },
        { countryid: "44", countryname: "Turkey", regionid: "1", airline: "Turkish Airlines" },
        { countryid: "45", countryname: "Turkmenistan", regionid: "1", airline: "Turkmenistan Airlines" },
        { countryid: "46", countryname: "United Arab Emirates", regionid: "1", airline: "Emirates" },
        { countryid: "47", countryname: "Uzbekistan", regionid: "1", airline: "Uzbekistan Airways" },
        { countryid: "48", countryname: "Vietnam", regionid: "1", airline: "Vietnam Airlines" },
        { countryid: "49", countryname: "Yemen", regionid: "1", airline: "Yemenia" },

        { countryid: "50", countryname: "Argentina", regionid: "2", airline: "Aerolineas Argentinas" },
        { countryid: "51", countryname: "Bahamas", regionid: "2", airline: "Bahamasair" },
        { countryid: "52", countryname: "Barbados", regionid: "2", airline: "Barbados National Airways" },
        { countryid: "53", countryname: "Belize", regionid: "2", airline: "Tropic Air" },
        { countryid: "54", countryname: "Bolivia", regionid: "2", airline: "Amaszonas" },
        { countryid: "55", countryname: "Brazil", regionid: "2", airline: "LATAM Airlines Brasil" },
        { countryid: "56", countryname: "Canada", regionid: "2", airline: "Air Canada" },
        { countryid: "57", countryname: "Chile", regionid: "2", airline: "LATAM Airlines" },
        { countryid: "58", countryname: "Colombia", regionid: "2", airline: "Avianca" },
        { countryid: "59", countryname: "Costa Rica", regionid: "2", airline: "Avianca Costa Rica" },
        { countryid: "60", countryname: "Cuba", regionid: "2", airline: "Cuban Airlines" },
        { countryid: "61", countryname: "Dominica", regionid: "2", airline: "Air Sunshine" },
        { countryid: "62", countryname: "Dominican Republic", regionid: "2", airline: "Pawa Dominicana" },
        { countryid: "63", countryname: "Ecuador", regionid: "2", airline: "AeroGal" },
        { countryid: "64", countryname: "El Salvador", regionid: "2", airline: "Avianca El Salvador" },
        { countryid: "65", countryname: "Grenada", regionid: "2", airline: "Air Grenada" },
        { countryid: "66", countryname: "Guatemala", regionid: "2", airline: "Avianca Guatemala" },
        { countryid: "67", countryname: "Guyana", regionid: "2", airline: "Essence Air" },
        { countryid: "68", countryname: "Haiti", regionid: "2", airline: "Air Haiti" },
        { countryid: "69", countryname: "Honduras", regionid: "2", airline: "Aerolineas Sosa" },
        { countryid: "70", countryname: "Jamaica", regionid: "2", airline: "Air Jamaica" },
        { countryid: "71", countryname: "Mexico", regionid: "2", airline: "Aeromexico" },
        { countryid: "72", countryname: "Nicaragua", regionid: "2", airline: "Avianca Nicaragua" },
        { countryid: "73", countryname: "Panama", regionid: "2", airline: "Copa Airlines" },
        { countryid: "74", countryname: "Paraguay", regionid: "2", airline: "Paraguay Air" },
        { countryid: "75", countryname: "Peru", regionid: "2", airline: "LATAM Peru" },
        { countryid: "76", countryname: "Saint Kitts and Nevis", regionid: "2", airline: "Nevis Air" },
        { countryid: "77", countryname: "Saint Lucia", regionid: "2", airline: "LIAT" },
        { countryid: "78", countryname: "Saint Vincent and the Grenadines", regionid: "2", airline: "SVG Air" },
        { countryid: "79", countryname: "Suriname", regionid: "2", airline: "Surinam Airways" },
        { countryid: "80", countryname: "Trinidad and Tobago", regionid: "2", airline: "Caribbean Airlines" },
        { countryid: "81", countryname: "United States", regionid: "2", airline: "American Airlines" },
        { countryid: "82", countryname: "Uruguay", regionid: "2", airline: "Aero Uruguay" },
        { countryid: "83", countryname: "Venezuela", regionid: "2", airline: "Conviasa" },

        { countryid: "84", countryname: "Albania", regionid: "3", airline: "Air Albania" },
        { countryid: "85", countryname: "Andorra", regionid: "3", airline: "Andorra Airlines" },
        { countryid: "86", countryname: "Armenia", regionid: "3", airline: "Armenia Air" },
        { countryid: "87", countryname: "Austria", regionid: "3", airline: "Austrian Airlines" },
        { countryid: "88", countryname: "Azerbaijan", regionid: "3", airline: "Azerbaijan Airlines" },
        { countryid: "89", countryname: "Belarus", regionid: "3", airline: "Belavia" },
        { countryid: "90", countryname: "Belgium", regionid: "3", airline: "Brussels Airlines" },
        { countryid: "91", countryname: "Bosnia and Herzegovina", regionid: "3", airline: "BH Airlines" },
        { countryid: "92", countryname: "Bulgaria", regionid: "3", airline: "Bulgaria Air" },
        { countryid: "93", countryname: "Croatia", regionid: "3", airline: "Croatia Airlines" },
        { countryid: "94", countryname: "Cyprus", regionid: "3", airline: "Cyprus Airways" },
        { countryid: "95", countryname: "Czech Republic", regionid: "3", airline: "Czech Airlines" },
        { countryid: "96", countryname: "Denmark", regionid: "3", airline: "SAS Airlines" },
        { countryid: "97", countryname: "Estonia", regionid: "3", airline: "Nordica" },
        { countryid: "98", countryname: "Finland", regionid: "3", airline: "Finnair" },
        { countryid: "99", countryname: "France", regionid: "3", airline: "Air France" },
        { countryid: "100", countryname: "Georgia", regionid: "3", airline: "Georgian Airways" },
        { countryid: "101", countryname: "Germany", regionid: "3", airline: "Lufthansa" },
        { countryid: "102", countryname: "Greece", regionid: "3", airline: "Aegean Airlines" },
        { countryid: "103", countryname: "Hungary", regionid: "3", airline: "Wizz Air" },
        { countryid: "104", countryname: "Iceland", regionid: "3", airline: "Icelandair" },
        { countryid: "105", countryname: "Ireland", regionid: "3", airline: "Aer Lingus" },
        { countryid: "106", countryname: "Italy", regionid: "3", airline: "Alitalia" },
        { countryid: "107", countryname: "Kazakhstan", regionid: "3", airline: "Air Astana" },
        { countryid: "108", countryname: "Kosovo", regionid: "3", airline: "Kosovo Air" },
        { countryid: "109", countryname: "Latvia", regionid: "3", airline: "Air Baltic" },
        { countryid: "110", countryname: "Liechtenstein", regionid: "3", airline: "Helvetic Airways" },
        { countryid: "111", countryname: "Lithuania", regionid: "3", airline: "Air Lituanica" },
        { countryid: "112", countryname: "Luxembourg", regionid: "3", airline: "Luxair" },
        { countryid: "113", countryname: "Malta", regionid: "3", airline: "Air Malta" },
        { countryid: "114", countryname: "Moldova", regionid: "3", airline: "Air Moldova" },
        { countryid: "115", countryname: "Monaco", regionid: "3", airline: "Monaco Air" },
        { countryid: "116", countryname: "Montenegro", regionid: "3", airline: "Montenegro Airlines" },
        { countryid: "117", countryname: "Netherlands", regionid: "3", airline: "KLM" },
        { countryid: "118", countryname: "North Macedonia", regionid: "3", airline: "Air Skopje" },
        { countryid: "119", countryname: "Norway", regionid: "3", airline: "Norwegian Air" },
        { countryid: "120", countryname: "Poland", regionid: "3", airline: "LOT Polish Airlines" },
        { countryid: "121", countryname: "Portugal", regionid: "3", airline: "TAP Air Portugal" },
        { countryid: "122", countryname: "Romania", regionid: "3", airline: "Tarom" },
        { countryid: "123", countryname: "Russia", regionid: "3", airline: "Aeroflot" },
        { countryid: "124", countryname: "San Marino", regionid: "3", airline: "San Marino Airlines" },
        { countryid: "125", countryname: "Serbia", regionid: "3", airline: "Air Serbia" },
        { countryid: "126", countryname: "Slovakia", regionid: "3", airline: "Slovak Airlines" },
        { countryid: "127", countryname: "Slovenia", regionid: "3", airline: "Adria Airways" },
        { countryid: "128", countryname: "Spain", regionid: "3", airline: "Iberia" },
        { countryid: "129", countryname: "Sweden", regionid: "3", airline: "SAS" },
        { countryid: "130", countryname: "Switzerland", regionid: "3", airline: "Swiss International Air Lines" },
        { countryid: "131", countryname: "Turkey", regionid: "3", airline: "Turkish Airlines" },
        { countryid: "132", countryname: "Ukraine", regionid: "3", airline: "Ukraine International Airlines" },
        { countryid: "133", countryname: "United Kingdom", regionid: "3", airline: "British Airways" },
        { countryid: "134", countryname: "Vatican City", regionid: "3", airline: "Vatican Airways" },

        { countryid: "135", countryname: "Algeria", regionid: "4", airline: "Air Algerie" },
        { countryid: "136", countryname: "Angola", regionid: "4", airline: "TAAG Angola Airlines" },
        { countryid: "137", countryname: "Benin", regionid: "4", airline: "Benin Airlines" },
        { countryid: "138", countryname: "Botswana", regionid: "4", airline: "Air Botswana" },
        { countryid: "139", countryname: "Burkina Faso", regionid: "4", airline: "Air Burkina" },
        { countryid: "140", countryname: "Burundi", regionid: "4", airline: "Bujumbura Airlines" },
        { countryid: "141", countryname: "Cabo Verde", regionid: "4", airline: "TACV Cabo Verde Airlines" },
        { countryid: "142", countryname: "Cameroon", regionid: "4", airline: "Camair-Co" },
        { countryid: "143", countryname: "Central African Republic", regionid: "4", airline: "Central African Airways" },
        { countryid: "144", countryname: "Chad", regionid: "4", airline: "Tchadia Airlines" },
        { countryid: "145", countryname: "Comoros", regionid: "4", airline: "Comoros Aviation" },
        { countryid: "146", countryname: "Congo (Congo-Brazzaville)", regionid: "4", airline: "ECAir" },
        { countryid: "147", countryname: "Democratic Republic of the Congo", regionid: "4", airline: "Congo Airways" },
        { countryid: "148", countryname: "Djibouti", regionid: "4", airline: "Djibouti Airlines" },
        { countryid: "149", countryname: "Egypt", regionid: "4", airline: "EgyptAir" },
        { countryid: "150", countryname: "Equatorial Guinea", regionid: "4", airline: "Ceiba Intercontinental" },
        { countryid: "151", countryname: "Eritrea", regionid: "4", airline: "Eritrean Airlines" },
        { countryid: "152", countryname: "Eswatini (Swaziland)", regionid: "4", airline: "Swazi Airlink" },
        { countryid: "153", countryname: "Ethiopia", regionid: "4", airline: "Ethiopian Airlines" },
        { countryid: "154", countryname: "Gabon", regionid: "4", airline: "RwandAir" },
        { countryid: "155", countryname: "Gambia", regionid: "4", airline: "Gambia International Airlines" },
        { countryid: "156", countryname: "Ghana", regionid: "4", airline: "Africa World Airlines" },
        { countryid: "157", countryname: "Guinea", regionid: "4", airline: "Guinea Airlines" },
        { countryid: "158", countryname: "Guinea-Bissau", regionid: "4", airline: "Azul Linhas Aéreas" },
        { countryid: "159", countryname: "Ivory Coast", regionid: "4", airline: "Air Côte d'Ivoire" },
        { countryid: "160", countryname: "Kenya", regionid: "4", airline: "Kenya Airways" },
        { countryid: "161", countryname: "Lesotho", regionid: "4", airline: "Air Lesotho" },
        { countryid: "162", countryname: "Liberia", regionid: "4", airline: "Liberian Airlines" },
        { countryid: "163", countryname: "Libya", regionid: "4", airline: "Libyan Airlines" },
        { countryid: "164", countryname: "Madagascar", regionid: "4", airline: "Air Madagascar" },
        { countryid: "165", countryname: "Malawi", regionid: "4", airline: "Malawi Airlines" },
        { countryid: "166", countryname: "Mali", regionid: "4", airline: "Mali Air" },
        { countryid: "167", countryname: "Mauritania", regionid: "4", airline: "Mauritania Airlines" },
        { countryid: "168", countryname: "Mauritius", regionid: "4", airline: "Air Mauritius" },
        { countryid: "169", countryname: "Morocco", regionid: "4", airline: "Royal Air Maroc" },
        { countryid: "170", countryname: "Mozambique", regionid: "4", airline: "LAM Mozambique Airlines" },
        { countryid: "171", countryname: "Namibia", regionid: "4", airline: "Air Namibia" },
        { countryid: "172", countryname: "Niger", regionid: "4", airline: "Air Niger" },
        { countryid: "173", countryname: "Nigeria", regionid: "4", airline: "Arik Air" },
        { countryid: "174", countryname: "Rwanda", regionid: "4", airline: "RwandAir" },
        { countryid: "175", countryname: "Sao Tome and Principe", regionid: "4", airline: "STP Airways" },
        { countryid: "176", countryname: "Senegal", regionid: "4", airline: "Air Senegal" },
        { countryid: "177", countryname: "Seychelles", regionid: "4", airline: "Air Seychelles" },
        { countryid: "178", countryname: "Sierra Leone", regionid: "4", airline: "Sierra Leone Airways" },
        { countryid: "179", countryname: "Somalia", regionid: "4", airline: "Daallo Airlines" },
        { countryid: "180", countryname: "South Africa", regionid: "4", airline: "South African Airways" },
        { countryid: "181", countryname: "South Sudan", regionid: "4", airline: "South Sudan Airways" },
        { countryid: "182", countryname: "Sudan", regionid: "4", airline: "Sudan Airways" },
        { countryid: "183", countryname: "Tanzania", regionid: "4", airline: "Air Tanzania" },
        { countryid: "184", countryname: "Togo", regionid: "4", airline: "Asky Airlines" },
        { countryid: "185", countryname: "Tunisia", regionid: "4", airline: "Tunisair" },
        { countryid: "186", countryname: "Uganda", regionid: "4", airline: "Uganda Airlines" },
        { countryid: "187", countryname: "Zambia", regionid: "4", airline: "Proflight Zambia" },
        { countryid: "188", countryname: "Zimbabwe", regionid: "4", airline: "Air Zimbabwe" },

        { countryid: "189", countryname: "Australia", regionid: "5", airline: "Qantas" },
        { countryid: "190", countryname: "Fiji", regionid: "5", airline: "Fiji Airways" },
        { countryid: "191", countryname: "Kiribati", regionid: "5", airline: "Air Kiribati" },
        { countryid: "192", countryname: "Marshall Islands", regionid: "5", airline: "Air Marshall Islands" },
        { countryid: "193", countryname: "Micronesia", regionid: "5", airline: "United Airlines" },
        { countryid: "194", countryname: "Nauru", regionid: "5", airline: "Nauru Airlines" },
        { countryid: "195", countryname: "New Zealand", regionid: "5", airline: "Air New Zealand" },
        { countryid: "196", countryname: "Palau", regionid: "5", airline: "Palau Airlines" },
        { countryid: "197", countryname: "Papua New Guinea", regionid: "5", airline: "Air Niugini" },
        { countryid: "198", countryname: "Samoa", regionid: "5", airline: "Talofa Airways" },
        { countryid: "199", countryname: "Solomon Islands", regionid: "5", airline: "Solomon Airlines" },
        { countryid: "200", countryname: "Tonga", regionid: "5", airline: "Real Tonga" },
        { countryid: "201", countryname: "Tuvalu", regionid: "5", airline: "Air Tuvalu" },
        { countryid: "202", countryname: "Vanuatu", regionid: "5", airline: "Air Vanuatu" }
    ];

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [adminid, setAdminid] = useState<string | null>('');
    const [adminname, setAdminname] = useState<string | null>('');
    const [adminpath, setAdminpath] = useState<string | null>('');
    const [tour, setTour] = useState<any>([]);
    const [tourPrices, setTourPrices] = useState<any>([]);
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [region, setRegion] = useState<any>([]);
    const [filteredCountries, setFilteredCountries] = useState<any>([]);
    const [flight, setFlight] = useState<any>([]);
    const [file, setFile] = useState<any>('');
    const [keyword, setKeyword] = useState<any>('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = currentPage === 1 ? 0 : indexOfLastItem - itemsPerPage;
    const currentTours = currentPage === 1
        ? tour.slice(indexOfFirstItem, indexOfFirstItem + 7)
        : tour.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tour.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const [createName, setCreateName] = useState<any>('');
    const [createCode, setCreateCode] = useState<any>('');
    const [createDescript, setCreateDescript] = useState<any>('');
    const [createDescription, setCreateDescription] = useState<any>('');
    const [createNumber, setCreateNumber] = useState<any>('');
    const [createStart, setCreateStart] = useState<any>('');
    const [createAirline, setCreateAirline] = useState<any>('');
    const [createFile, setCreateFile] = useState<any>('');
    const [createPlace, setCreatePlace] = useState<any>('');
    const [createRegion, setCreateRegion] = useState<any>('');
    const [createAdult, setCreateAdult] = useState<any>('');
    const [createChildren, setCreateChildren] = useState<any>('');
    const [createBaby, setCreateBaby] = useState<any>('');

    const [editTourid, setEditTourid] = useState<any>('');
    const [editName, setEditName] = useState<any>('');
    const [editCode, setEditCode] = useState<any>('');
    const [editDescript, setEditDescript] = useState<any>('');
    const [editDescription, setEditDescription] = useState<any>('');
    const [editNumber, setEditNumber] = useState<any>('');
    const [editStart, setEditStart] = useState<any>('');
    const [editAirline, setEditAirline] = useState<any>('');
    const [editFile, setEditFile] = useState<any>();
    const [editPlace, setEditPlace] = useState<any>('');
    const [editRegion, setEditRegion] = useState<any>('');
    const [editAdult, setEditAdult] = useState<any>('');
    const [editChildren, setEditChildren] = useState<any>('');
    const [editBaby, setEditBaby] = useState<any>('');

    const handleCreateOpen = () => setCreateOpen(true);
    const handleCloseCreateOpen = () => setCreateOpen(false);

    const handleCloseEditOpen = () => setEditOpen(false);

    const handleEditOpen = (tourid: number) => {
        setEditOpen(true);
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findByTourIdAndRegion`, {
            tourid
        }).then(res => {
            setEditTourid(res.data.tourid);
            setEditFile(res.data.tourpath);
            setEditName(res.data.tourname);
            setEditCode(res.data.tourcode);
            setEditDescript(res.data.descrip);
            setEditDescription(res.data.desclong);
            setEditNumber(res.data.totaldate);
            setEditStart(res.data.startdate);
            setEditAirline(res.data.airline);
            const selectedRegion = res.data.region.regionid;
            setEditRegion(selectedRegion);
            setEditPlace(res.data.nation);
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        });

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tourprice/findPriceByTourId`, {
            tourid
        }).then(res => {
            const adult = res.data.find((item: any) => item.age.agegroup === 'adult');
            const children = res.data.find((item: any) => item.age.agegroup === 'children');
            const baby = res.data.find((item: any) => item.age.agegroup === 'baby');

            if (adult) {
                setEditAdult(adult.price);
            }
            if (children) {
                setEditChildren(children.price);
            }
            if (baby) {
                setEditBaby(baby.price);
            }
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        });
    }

    useEffect(() => {
        if (editRegion) {
            const filtered = countries.filter(country => country.regionid == editRegion);
            setFilteredCountries(filtered);
        }
    }, [editRegion]);

    const handleRegionChange = (e: any) => {
        const selectedRegion = e.target.value;
        setCreateRegion(selectedRegion);

        const filtered = countries.filter(country => country.regionid === selectedRegion);
        setFilteredCountries(filtered);
        setCreatePlace('');
    };

    const handleEditRegionChange = (e: any) => {
        const selectedRegion = e.target.value;
        setEditRegion(selectedRegion);

        const filtered = countries.filter(country => country.regionid === selectedRegion);
        setFilteredCountries(filtered);
        setEditPlace('')
    };

    useEffect(() => {
        setFlight(countries);
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const admin = sessionStorage.getItem('admin');
            setAdminid(admin);
        }
    }, [adminid]);

    useEffect(() => {
        const checkAuthentication = async () => {
            if (!checkAuth()) {
                const result = await Swal.fire({
                    title: 'Vui lòng đăng nhập',
                    text: 'Bạn cần đăng nhập để tiếp tục sử dụng dịch vụ',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#f8b602'
                });
                if (result.isConfirmed) {
                    window.location.href = '/';
                }

            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuthentication();
    }, []);

    const handleUpload = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'tmz6fhxc');
        const resourceType = 'image';
        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/dlj9sdjb6/${resourceType}/upload`, formData);
            console.log('Upload thành công: ' + response.data);
            return response.data.secure_url;
        } catch (error) {
            console.log('Upload thất bại: ' + error);
        }
    }

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/region/getAllRegion`)
            .then(res => {
                setRegion(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, []);

    useEffect(() => {
        if (isAuthenticated && typeof window !== 'undefined') {
            const id = sessionStorage.getItem('admin');
            const name = sessionStorage.getItem('adminname');
            const path = sessionStorage.getItem('adminavatar');

            setAdminid(id);
            setAdminname(name);
            setAdminpath(path);
        }
    }, [isAuthenticated]);

    const fetchTourPrice = async (tourid: any) => {
        try {
            const response = await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tourprice/findPriceByTourId`, { tourid: tourid });
            console.log(response.data);
            setTourPrices((prevPrices: any) => ({
                ...prevPrices,
                [tourid]: response.data,
            }));
        } catch (error) {
            console.error('Lỗi khi lấy giá tour:', error);
        }
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setCreateFile(previewUrl);
            setFile({ file: file, fileName: file.name, type: 'image' });
        }
    };

    const handleDelete = (tourid: number) => {
        Swal.fire({
            title: 'Bạn chắc chắn chứ?',
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa chuyến đi!',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/delete`, {
                    tourid
                }).then(res => {
                    const currentDate = new Date();
                    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
                    fetchData();
                    const successMessage = 'Deleted Tour successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    setEditOpen(false);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
            } else {
                Swal.fire({
                    title: 'Đã hủy',
                    text: 'Bạn đã hủy việc xóa chuyến đi!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
    }

    const handleUpdate = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let errorMessage = '';
        let imgairline = '/assets/images/airline/vietnamairlines.png';

        if (!editName) {
            errorMessage += 'Tên sản phẩm không được trống\n';
        }

        if (!editDescript) {
            errorMessage += 'Miêu tả không được trống\n';
        }

        if (!editDescription) {
            errorMessage += 'Mô tả không được trống\n';
        }

        if (!editNumber) {
            errorMessage += 'Tổng số ngày không được trống\n';
        }

        if (!editStart) {
            errorMessage += 'Ngày khởi hành không được trống\n';
        }

        if (!editAirline) {
            errorMessage += 'Hãng hàng không không được trống\n';
        }

        if (!editFile) {
            errorMessage += 'Hình ảnh chuyến đi không được trống\n';
        }

        if (!editRegion) {
            errorMessage += 'Quốc gia không được trống\n';
        }

        if (!editPlace) {
            errorMessage += 'Nơi đến không được trống\n';
        }

        if (!editAdult) {
            errorMessage += 'Giá người lớn không được trống\n';
        }

        if (!editChildren) {
            errorMessage += 'Giá trẻ em không được trống\n';
        }

        if (!editBaby) {
            errorMessage += 'Giá em bé không được trống\n';
        }

        if (!adminid) {
            errorMessage += 'Vui lòng đăng nhập\n';
        }

        if (errorMessage) {
            toast.error(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        }

        let result;
        if (file && file.file) {
            result = await handleUpload(file.file);
        } else {
            result = editFile;
        }

        const editData = {
            tourname: editName,
            descrip: editDescript,
            description: editDescription,
            totaldate: editNumber,
            startdate: editStart,
            airline: editAirline,
            imgairline: imgairline,
            tourpath: result,
            region: editRegion,
            admin: adminid,
            nation: editPlace,
            priceadult: editAdult,
            pricechildren: editChildren,
            pricebaby: editBaby,
            tourcode: editCode,
            tourid: editTourid
        }

        if (editData) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/update`, editData)
                .then(res => {
                    setEditOpen(false);
                    fetchData();
                    const successMessage = 'Updated Tour successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    fetchData();
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        }
    }

    const handleEditFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setEditFile(previewUrl);
            setFile({ file: file, fileName: file.name, type: 'image' });
        }
    }

    useEffect(() => {
        tour.forEach((item: any) => fetchTourPrice(item.tourid));
    }, [tour]);

    useEffect(() => {
        if (keyword) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findByTourCode`, {
                keyword
            })
                .then(res => {
                    setTour(res.data);
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        } else {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findAllTour`)
                .then(res => {
                    setTour(res.data);
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        }
    }, [keyword]);

    const fetchData = () => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findAllTour`)
            .then(res => {
                setTour(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }

    const handleCreate = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let errorMessage = '';
        let imgairline = '/assets/images/airline/vietnamairlines.png';

        if (!createName) {
            errorMessage += 'Tên sản phẩm không được trống\n';
        }

        if (!createDescript) {
            errorMessage += 'Miêu tả không được trống\n';
        }

        if (!createDescription) {
            errorMessage += 'Mô tả không được trống\n';
        }

        if (!createNumber) {
            errorMessage += 'Tổng số ngày không được trống\n';
        }

        if (!createStart) {
            errorMessage += 'Ngày khởi hành không được trống\n';
        }

        if (!createAirline) {
            errorMessage += 'Hãng hàng không không được trống\n';
        }

        if (!createFile) {
            errorMessage += 'Hình ảnh chuyến đi không được trống\n';
        }

        if (!createRegion) {
            errorMessage += 'Quốc gia không được trống\n';
        }

        if (!createPlace) {
            errorMessage += 'Nơi đến không được trống\n';
        }

        if (!createAdult) {
            errorMessage += 'Giá người lớn không được trống\n';
        }

        if (!createChildren) {
            errorMessage += 'Giá trẻ em không được trống\n';
        }

        if (!createBaby) {
            errorMessage += 'Giá em bé không được trống\n';
        }

        if (!adminid) {
            errorMessage += 'Vui lòng đăng nhập\n';
        }

        if (errorMessage) {
            toast.error(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        }
        if (file && file.file) {
            const result = await handleUpload(file.file);

            const createData = {
                tourname: createName,
                descrip: createDescript,
                description: createDescription,
                totaldate: createNumber,
                startdate: createStart,
                airline: createAirline,
                imgairline: imgairline,
                tourpath: result,
                region: createRegion,
                admin: adminid,
                nation: createPlace,
                priceadult: createAdult,
                pricechildren: createChildren,
                pricebaby: createBaby,
                tourcode: createCode
            }

            if (createData) {
                await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/create`, createData)
                    .then(res => {
                        console.log(res.data);
                        setCreateName('');
                        setCreateDescript('');
                        setCreateDescription('');
                        setCreateNumber('');
                        setCreateStart('');
                        setCreateAirline('');
                        setFile('');
                        setCreateFile('');
                        setCreateRegion('');
                        setCreatePlace('');
                        setCreateAdult('');
                        setCreateChildren('');
                        setCreateBaby('');
                        setCreateCode('');
                        fetchData();
                        const successMessage = 'Created Tour successfully';
                        toast.success(successMessage, {
                            description: formattedDate,
                            action: {
                                label: "Undo",
                                onClick: () => console.log("Undo"),
                            },
                        });
                        setCreateOpen(false);
                    }).catch(err => {
                        console.log('Error fetch data: ' + err);
                    })
            }
        } else {
            const successMessage = 'Update Avatar fail';
            toast.error(successMessage, {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
        }
    }

    useEffect(() => {
        if (!createOpen) {
            setCreateName('');
            setCreateDescript('');
            setCreateDescription('');
            setCreateNumber('');
            setCreateStart('');
            setCreateAirline('');
            setFile('');
            setCreateFile('');
            setCreateRegion('');
            setCreatePlace('');
            setCreateAdult('');
            setCreateChildren('');
            setCreateBaby('');
            setCreateCode('');
        }
    }, [createOpen]);

    return (
        <div className={isAuthenticated ? '' : 'blurred-content'}>
            <div className="mx-10">
                <div className="flex items-center justify-between">
                    <p className="text-[1.2rem] font-sans font-semibold">Du lịch</p>
                    <div className="w-[35%] flex items-center justify-around">
                        <input
                            type="text"
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Nhập mã chuyến đi..."
                            className="w-[75%] mr-3 py-1 px-3 border-[1px] border-solid border-[#ccc] focus:outline-none rounded-md" />
                        <Information />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-10 mt-8">
                    {currentPage === 1 && (
                        <div
                            onClick={handleCreateOpen}
                            className="w-full h-[400px] bg-white border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer">
                            <div className="w-[calc(100%-10%)] mt-5 mx-[5%] h-[250px] bg-[#ccc] rounded-lg">
                                <div className="flex items-center justify-center">
                                    <FontAwesomeIcon className="text-[50px] relative top-24 text-white" icon={faPlus} />
                                </div>
                            </div>
                            <p className="mt-5 text-[20px] font-semibold text-center">Sản phẩm mới</p>
                        </div>
                    )}
                    {currentTours.map((item: any) => (
                        <div
                            onClick={() => handleEditOpen(item.tourid)}
                            key={item.tourid}
                            className="w-full h-[400px] bg-white border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer">
                            <div className={`w-[calc(100%-10%)] mt-5 mx-[5%] h-[150px] bg-[#ccc] rounded-lg relative`}>
                                <img src={item.tourpath} alt="Tour Image" className="w-full h-full object-cover object-center rounded-lg" />
                            </div>
                            <p className="mt-2 mx-[5%] text-center text-[1.125rem] font-medium">{item.tourname}</p>
                            <p className="text-center mx-[5%] italic font-semibold text-[.75rem] mb-3"><FontAwesomeIcon className="mr-1" icon={faQrcode} />{item.tourcode}</p>
                            <p className="text-[.75rem] text-center mx-[5%]">{item.descrip}</p>
                            <div>
                                <div className="mt-2 mx-[5%] space-x-1 flex items-center justify-center text-center">
                                    {tourPrices[item.tourid] ? (
                                        tourPrices[item.tourid].map((priceInfo: any) => (
                                            <div key={priceInfo.tourpriceid} className="text-[.75rem]">
                                                <div className="w-fit">
                                                    <div className="flex py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md">
                                                        <p>
                                                            <FontAwesomeIcon className="mr-1" icon={priceInfo.age.agegroup === 'adult' ? faUserTie : priceInfo.age.agegroup === 'children' ? faChild : faBaby} />
                                                            {priceInfo.age.agegroup} ${priceInfo.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[.75rem]">Loading tour prices...</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mx-5 mt-5">
                                    <div>
                                        <FontAwesomeIcon className="mr-2 text-blue-500" icon={faLocationDot} />
                                        <span className="text-[.8rem]">{item.nation}</span>
                                    </div>
                                    <div>|</div>
                                    <div>
                                        <FontAwesomeIcon className="mr-2 text-yellow-600" icon={faCalendarAlt} />
                                        <span className="text-[.8rem]">{item.totaldate} Days {item.totaldate - 1} Nights</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center my-5 space-x-2">
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`mx-1 ${number === currentPage ? 'bg-[#000000] text-[#fff] rounded-[50%] font-bold w-[40px] h-[40px] p-[5px]' : 'bg-[#eee] text-[#374151] rounded-[50%] w-[40px] h-[40px] p-[5px] '} hover:bg-[#89bde7] hover:text-[#000]`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
                {createOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer" onClick={handleCloseCreateOpen}>
                        <div className="bg-white w-full mx-32 p-6 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl text-center font-semibold mb-2">Thêm sản phẩm mới</h2>
                            <div className="flex">
                                <div className="w-[25%]">
                                    <p className="text-[1.25rem] my-3 font-semibold">Thông tin sản phẩm</p>
                                    <div className="mt-3">
                                        <label>Hình ảnh chuyến du lịch</label>
                                        <input
                                            onChange={handleFileChange}
                                            type="file"
                                            accept='image/*'
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <label>Tên sản phẩm</label>
                                        <input type="text"
                                            onChange={(e) => setCreateName(e.target.value)}
                                            placeholder="Nhập tên sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Mã sản phẩm</label>
                                        <input type="text"
                                            onChange={(e) => setCreateCode(e.target.value)}
                                            placeholder="Nhập mã của sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Mô tả ngắn</label>
                                        <input type="text"
                                            onChange={(e) => setCreateDescript(e.target.value)}
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Mô tả</label>
                                        <textarea
                                            onChange={(e) => setCreateDescription(e.target.value)}
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full h-32 mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" ></textarea>
                                    </div>
                                    <div className="mt-3">
                                        <label>Tổng số ngày</label>
                                        <input type="text"
                                            onChange={(e) => setCreateNumber(e.target.value)}
                                            placeholder="Nhập số ngày của chuyến đi..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                </div>
                                <div className="w-[25%] mx-[5%]">
                                    <div className="mt-3">
                                        <label>Ngày khởi hành</label>
                                        <input type="date"
                                            onChange={(e) => setCreateStart(e.target.value)}
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Hãng hàng không</label>
                                        <select onChange={(e) => setCreateAirline(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                            <option>Chọn hãng hàng không</option>
                                            {flight.map((item: any) => (
                                                <option key={item.countryid} value={item.airline}>{item.airline}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mt-3">
                                        <label>Nơi đến</label>
                                        <select onChange={handleRegionChange} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                            <option>Chọn nơi đến</option>
                                            {region.map((item: any) => (
                                                <option key={item.regionid} value={item.regionid}>{item.regionname}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-3">
                                        <label>Quốc gia</label>
                                        <select
                                            value={createPlace}
                                            onChange={(e) => setCreatePlace(e.target.value)}
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                        >
                                            <option value="">Chọn quốc gia</option>
                                            {filteredCountries.map((country: any) => (
                                                <option key={country.countryid} value={country.countryname}>
                                                    {country.countryname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className="text-[1.25rem] my-5 font-semibold">Giá sản phẩm</p>
                                    <div className="mt-3">
                                        <label>Người lớn</label>
                                        <input
                                            onChange={(e) => setCreateAdult(e.target.value)}
                                            type="text"
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Trẻ em</label>
                                        <input
                                            onChange={(e) => setCreateChildren(e.target.value)}
                                            type="text"
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Em bé</label>
                                        <input
                                            onChange={(e) => setCreateBaby(e.target.value)}
                                            type="text"
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                </div>
                                <div className="w-[32%] mx-[8%]">
                                    <p className="text-[1.25rem] my-3 font-semibold">Xem trước</p>
                                    <div className="w-100% relative mx-4 h-[550px] border-[1px] border-solid border-[#ccc] rounded-lg">
                                        {createFile && (
                                            <img className="px-4 pt-4 w-full object-cover h-[200px]" src={createFile} />
                                        )}
                                        {createName && (
                                            <p className="mt-1 text-[1.25rem] text-center font-bold">{createName}</p>
                                        )}
                                        {createCode && (
                                            <p className="text-center italic text-[.75rem]"><FontAwesomeIcon className="mr-1" icon={faQrcode} /> {createCode}</p>
                                        )}
                                        {createDescript && (
                                            <p className="w-100% mt-5 mx-4 break-words">{createDescript}</p>
                                        )}
                                        {createNumber && (
                                            <div className="absolute top-10 right-0 py-1 px-4 bg-yellow-500 text-white rounded-s-md font-semibold">
                                                {createNumber} Days {createNumber - 1} Nights
                                            </div>
                                        )}
                                        {createAdult && (
                                            <div className="flex mx-4 mt-5 space-x-2">
                                                <div className="w-full flex items-center py-1 px-3 border-[1px] border-solid border-[#ccc] rounded-md">
                                                    <FontAwesomeIcon className="mr-1" icon={faUserTie} />
                                                    <p>Người lớn: ${createAdult}</p>
                                                </div>
                                            </div>
                                        )}
                                        {createChildren && (
                                            <div className="flex mx-4 mt-2 space-x-2">
                                                <div className="w-full flex items-center py-1 px-3 border-[1px] border-solid border-[#ccc] rounded-md">
                                                    <FontAwesomeIcon className="mr-1" icon={faChild} />
                                                    <p>Trẻ em: ${createChildren}</p>
                                                </div>
                                            </div>
                                        )}
                                        {createBaby && (
                                            <div className="flex mx-4 mt-2 space-x-2">
                                                <div className="w-full flex items-center py-1 px-3 border-[1px] border-solid border-[#ccc] rounded-md">
                                                    <FontAwesomeIcon className="mr-1" icon={faBaby} />
                                                    <p>Em bé: ${createBaby}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center mx-5 mt-5">
                                            {createPlace && (
                                                <div className="flex items-center justify-center">
                                                    <FontAwesomeIcon className="mr-2" icon={faLocationDot} />
                                                    {createPlace}
                                                </div>
                                            )}
                                            {createPlace && createStart && (
                                                <div className="flex items-center justify-center mx-3">|</div>
                                            )}
                                            {createStart && (
                                                <div className="flex items-center justify-center">
                                                    <FontAwesomeIcon className="mr-2" icon={faCalendarAlt} />
                                                    {createStart}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex mt-5 space-x-3">
                                        <button
                                            onClick={handleCloseCreateOpen}
                                            className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            onClick={handleCreate}
                                            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                        >
                                            Tạo chuyến đi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {editOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer" onClick={handleCloseEditOpen}>
                        <div className="bg-white w-full mx-32 p-6 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl text-center font-semibold mb-2">Sửa sản phẩm</h2>
                            <div className="flex">
                                <div className="w-[25%]">
                                    <p className="text-[1.25rem] my-3 font-semibold">Thông tin sản phẩm</p>
                                    <div className="mt-3">
                                        <label>Hình ảnh chuyến du lịch</label>
                                        <input
                                            onChange={handleEditFileChange}
                                            type="file"
                                            accept='image/*'
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label>Tên sản phẩm</label>
                                        <input type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Nhập tên sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Mã sản phẩm</label>
                                        <input type="text"
                                            value={editCode}
                                            onChange={(e) => setEditCode(e.target.value)}
                                            placeholder="Nhập mã của sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Mô tả ngắn</label>
                                        <input type="text"
                                            value={editDescript}
                                            onChange={(e) => setEditDescript(e.target.value)}
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Mô tả</label>
                                        <textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full h-32 mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" ></textarea>
                                    </div>
                                    <div className="mt-3">
                                        <label>Tổng số ngày</label>
                                        <input type="text"
                                            value={editNumber}
                                            onChange={(e) => setEditNumber(e.target.value)}
                                            placeholder="Nhập số ngày của chuyến đi..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                </div>
                                <div className="w-[25%] mx-[5%]">
                                    <div className="mt-3">
                                        <label>Ngày khởi hành</label>
                                        <input type="date"
                                            value={editStart}
                                            onChange={(e) => setEditStart(e.target.value)}
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Hãng hàng không</label>
                                        <select value={editAirline} onChange={(e) => setEditAirline(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                            <option>Chọn hãng hàng không</option>
                                            {flight.map((item: any) => (
                                                <option key={item.countryid} value={item.airline}>{item.airline}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mt-3">
                                        <label>Nơi đến</label>
                                        <select value={editRegion} onChange={handleEditRegionChange} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                            <option>Chọn nơi đến</option>
                                            {region.map((item: any) => (
                                                <option key={item.regionid} value={item.regionid}>{item.regionname}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-3">
                                        <label>Quốc gia</label>
                                        <select value={editPlace} onChange={(e) => setEditPlace(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                            <option value="">Chọn quốc gia</option>
                                            {filteredCountries.map((country: any) => (
                                                <option key={country.countryid} value={country.countryname}>
                                                    {country.countryname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className="text-[1.25rem] my-5 font-semibold">Giá sản phẩm</p>
                                    <div className="mt-3">
                                        <label>Người lớn</label>
                                        <input
                                            value={editAdult}
                                            onChange={(e) => setEditAdult(e.target.value)}
                                            type="text"
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Trẻ em</label>
                                        <input
                                            value={editChildren}
                                            onChange={(e) => setEditChildren(e.target.value)}
                                            type="text"
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                    <div className="mt-3">
                                        <label>Em bé</label>
                                        <input
                                            value={editBaby}
                                            onChange={(e) => setEditBaby(e.target.value)}
                                            type="text"
                                            placeholder="Nhập mô tả sản phẩm..."
                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                    </div>
                                </div>
                                <div className="w-[40%] mx-[8%]">
                                    <p className="text-[1.25rem] my-3 font-semibold">Xem trước</p>
                                    <div className="w-100% relative mx-4 h-[550px] border-[1px] border-solid border-[#ccc] rounded-lg">
                                        {editFile && (
                                            <img className="px-4 pt-4 w-full object-cover h-[200px]" src={editFile} alt="Tour Image" />
                                        )}
                                        {editName && (
                                            <p className="mt-1 text-[1.25rem] text-center font-bold">{editName}</p>
                                        )}
                                        {editCode && (
                                            <p className="text-center italic text-[.75rem]"><FontAwesomeIcon className="mr-1" icon={faQrcode} /> {editCode}</p>
                                        )}
                                        {editDescript && (
                                            <p className="w-100% mt-5 mx-4 break-words">{editDescript}</p>
                                        )}
                                        {editNumber && (
                                            <div className="absolute top-10 right-0 py-1 px-4 bg-yellow-500 text-white rounded-s-md font-semibold">
                                                {editNumber} Days {editNumber - 1} Nights
                                            </div>
                                        )}
                                        {editAdult && (
                                            <div className="flex mx-4 mt-5 space-x-2">
                                                <div className="w-full flex items-center py-1 px-3 border-[1px] border-solid border-[#ccc] rounded-md">
                                                    <FontAwesomeIcon className="mr-1" icon={faUserTie} />
                                                    <p>Người lớn: ${editAdult}</p>
                                                </div>
                                            </div>
                                        )}
                                        {editChildren && (
                                            <div className="flex mx-4 mt-2 space-x-2">
                                                <div className="w-full flex items-center py-1 px-3 border-[1px] border-solid border-[#ccc] rounded-md">
                                                    <FontAwesomeIcon className="mr-1" icon={faChild} />
                                                    <p>Trẻ em: ${editChildren}</p>
                                                </div>
                                            </div>
                                        )}
                                        {editBaby && (
                                            <div className="flex mx-4 mt-2 space-x-2">
                                                <div className="w-full flex items-center py-1 px-3 border-[1px] border-solid border-[#ccc] rounded-md">
                                                    <FontAwesomeIcon className="mr-1" icon={faBaby} />
                                                    <p>Em bé: ${editBaby}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center mx-5 mt-5">
                                            {editPlace && (
                                                <div className="flex items-center justify-center">
                                                    <FontAwesomeIcon className="mr-2" icon={faLocationDot} />
                                                    {editPlace}
                                                </div>
                                            )}
                                            {editPlace && editStart && (
                                                <div className="flex items-center justify-center mx-3">|</div>
                                            )}
                                            {editStart && (
                                                <div className="flex items-center justify-center">
                                                    <FontAwesomeIcon className="mr-2" icon={faCalendarAlt} />
                                                    {editStart}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex mt-5 space-x-3">
                                        <button
                                            onClick={handleCloseEditOpen}
                                            className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            onClick={() => handleDelete(editTourid)}
                                            className="w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tourist;