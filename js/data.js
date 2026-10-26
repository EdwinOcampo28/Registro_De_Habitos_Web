(function(){
 const habits=[
  {name:'Levantarte a una hora constante',category:'Descanso y rutina'},
  {name:'Acostarte a una hora constante',category:'Descanso y rutina'},
  {name:'Iniciar una rutina de descanso de 10 minutos',category:'Descanso y rutina'},
  {name:'Beber un vaso de agua al despertar',category:'Salud y bienestar'},
  {name:'Moverte o estirar 5 minutos',category:'Salud y bienestar'},
  {name:'Caminar o moverte 10 minutos',category:'Salud y bienestar'},
  {name:'Incluir fruta o verdura en una comida',category:'Salud y bienestar'},
  {name:'Añadir proteína y verdura al almuerzo',category:'Salud y bienestar'},
  {name:'Tomar una pausa activa',category:'Salud y bienestar'},
  {name:'Respirar o meditar 5 minutos',category:'Bienestar emocional'},
  {name:'Respetar mi límite de redes sociales',category:'Bienestar emocional'},
  {name:'Planear mañana en 5 minutos',category:'Aprendizaje y productividad'},
  {name:'Leer 10 minutos',category:'Aprendizaje y productividad'},
  {name:'Enfocarte 25 minutos en una prioridad',category:'Aprendizaje y productividad'},
  {name:'Revisar gastos y cuentas por pagar (15 min)',category:'Finanzas personales'},
  {name:'Apartar una cantidad sostenible para ahorro',category:'Finanzas personales'}
 ];
 const categories=['Salud y bienestar','Descanso y rutina','Bienestar emocional','Aprendizaje y productividad','Finanzas personales'];
 const habitAliases={
  'Despertar temprano':'Levantarte a una hora constante',
  'Dormir antes de las 11 p.m.':'Acostarte a una hora constante',
  'Rutina relajante':'Iniciar una rutina de descanso de 10 minutos',
  'Beber agua':'Beber un vaso de agua al despertar',
  'Hidratación continua':'Beber un vaso de agua al despertar',
  'Estiramientos':'Moverte o estirar 5 minutos',
  'Ejercicio ligero':'Caminar o moverte 10 minutos',
  'Meditación':'Respirar o meditar 5 minutos',
  'Lectura diaria':'Leer 10 minutos',
  'Estudio / Trabajo productivo':'Enfocarte 25 minutos en una prioridad',
  'Ocio digital controlado':'Respetar mi límite de redes sociales',
  'No redes después de 8 p.m.':'Respetar mi límite de redes sociales',
  'Almuerzo balanceado':'Añadir proteína y verdura al almuerzo',
  'Pausas activas':'Tomar una pausa activa',
  'Desayuno saludable':'Incluir fruta o verdura en una comida'
 };
 const starterFocusHabits=['Planear mañana en 5 minutos','Enfocarte 25 minutos en una prioridad','Revisar gastos y cuentas por pagar (15 min)'];
 const starterPlans={
  'Planear mañana en 5 minutos':{days:[0,1,2,3,4,5,6],cue:'Al cerrar el día',minimum:'Anotar una prioridad',planB:'Si la noche se complica, escribirla al despertar.'},
  'Enfocarte 25 minutos en una prioridad':{days:[1,2,3,4,5],cue:'Al iniciar mi jornada',minimum:'Empezar durante 5 minutos',planB:'Si me interrumpen, retomar con un bloque corto.'},
  'Revisar gastos y cuentas por pagar (15 min)':{days:[0],cue:'Una vez por semana, en un momento tranquilo',minimum:'Revisar los próximos pagos',planB:'Si tengo poco tiempo, mirar vencimientos y saldo.'},
  'Apartar una cantidad sostenible para ahorro':{days:[5],cue:'Al recibir ingresos; ajustar este día al día de pago',minimum:'Separar una cantidad que sí pueda sostener',planB:'Si esta vez no puedo ahorrar, revisar el presupuesto.'}
 };
 window.HabitData={habits,categories,habitAliases,starterFocusHabits,starterPlans};
})();
