// Islamic calendar foundation
export const islamicMonths = [
  'Muharram','Safar','Rabi al-Awwal','Rabi al-Thani',
  'Jumada al-Awwal','Jumada al-Thani','Rajab','Shaaban',
  'Ramadan','Shawwal','Dhul Qadah','Dhul Hijjah'
];

export const ramadanCalendar = Array.from({length:30},(_,i)=>({
  day:i+1,
  label:`Ramadan ${i+1}`,
  date:null,
  fasting:true,
  sehri:null,
  iftar:null
}));
