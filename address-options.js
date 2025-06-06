const apartmentsByAddress = {
    "Tellusgatan 17": [1602, 1601, 1502, 1501, 1403, 1402, 1401, 1303, 1302, 1301, 1203, 1202, 1201, 1102, 1101],
    "Tellusgången 32": [1603, 1602, 1601, 1504, 1503, 1502, 1501, 1404, 1403, 1402, 1401, 1304, 1303, 1302, 1301, 1202, 1201, 1102, 1101],
    "Tellusgången 34": [1603, 1602, 1601, 1504, 1503, 1502, 1501, 1404, 1403, 1402, 1401, 1304, 1303, 1302, 1301, 1104, 1103, 1102, 1101],
    "Mobilgatan 10": [1502, 1501, 1402, 1401, 1303, 1302, 1301, 1203, 1202, 1201, 1103, 1102, 1101, 1002, 1101],
    "Snickerigatan 9": [1603, 1602, 1601, 1504, 1503, 1502, 1501, 1404, 1403, 1402, 1401, 1304, 1303, 1302, 1301, 1204, 1203, 1202, 1201, 1101],
    "Snickerigatan 11": [1503, 1502, 1501, 1404, 1403, 1402, 1401, 1304, 1303, 1302, 1301, 1204, 1203, 1202, 1201, 1103, 1102, 1101, 1001]
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const addressSelect = document.getElementById('address');
    const apartmentSelect = document.getElementById('apartmentNumber');
  
    Object.keys(apartmentsByAddress).forEach(address => {
      const option = document.createElement('option');
      option.value = address;
      option.textContent = address;
      addressSelect.appendChild(option);
    });
  
    addressSelect.addEventListener('change', () => {
      const selected = addressSelect.value;
      apartmentSelect.innerHTML = '<option value="">Select apartment</option>';
      apartmentSelect.disabled = !selected;
  
      if (selected) {
        apartmentsByAddress[selected].forEach(num => {
          const opt = document.createElement('option');
          opt.value = num;
          opt.textContent = num;
          apartmentSelect.appendChild(opt);
        });
      }
    });
  });
