exports.differ = (old_data, new_data)=> {
	arr1 = old_data.split("\n");
	arr2 = new_data.split("\n");
	arr3 = []

	cb = -1;
	cm = 0;

	//logic: 
	for (let i = 0 ; i < arr1.length; i++){
		let j = cm; 
		while (true){
			
			if (j >= arr2.length){
				arr3.push(arr1[i]);
				break;
			}
			
			if arr1[i] == arr2[j]{
				cm = j+1;
				if cb != -1{
					arr3.push("---VS---");
					for (let k = cb; k < j; k++){
						arr3.push(arr2[k]);
					}
					arr3.push("-^-^.CONFLICT-new changes.^-^-"); 
				}
				cb = -1;
				arr3.push(arr1[i]);
				break;
			}

			if (arr1[i] != arr2[j]){
				if (cb == -1){
					arr3.append("-v-v.CONFLICT-original-data.v-v-");
					cb = j;
				}
			}

			if (j == arr2.length){
				arr3.append(arr1[i]);
			}
			j++;
		}
	}

	return arr3.toString("\n");
}
