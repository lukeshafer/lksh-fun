import { Table } from 'sst/node/table';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
	type Attribute,
	EntityConfiguration,
	Entity,
	Service,
} from 'electrodb';
import { gamePhases, playerStatuses } from './schemas';

const config = {
	table: Table.FridgeMagnets.tableName,
	client: new DocumentClient(),
} satisfies EntityConfiguration;

export const WSConnection = new Entity(
	{
		model: {
			entity: 'WSConnection',
			service: 'FridgeMagnets',
			version: '1',
		},
		attributes: {
			connectionId: {
				type: 'string',
				required: true,
			},
		},
		indexes: {
			primary: {
				pk: {
					field: 'pk',
					composite: ['connectionId'],
				},
				sk: {
					field: 'sk',
					composite: [],
				},
			},
		},
	},
	config
);

export const Room = new Entity(
	{
		model: {
			entity: 'Room',
			service: 'FridgeMagnets',
			version: '1',
		},
		attributes: {
			roomId: {
				type: 'string',
				required: true,
			},
			phase: {
				type: gamePhases,
				required: true,
				default: 'lobby',
			},
			turn: {
				type: 'number',
				required: true,
				default: 0,
			},
			showcaseId: {
				type: 'string',
				required: true,
				default: '',
			},
		},
		indexes: {
			primary: {
				pk: {
					field: 'pk',
					composite: ['roomId'],
				},
				sk: {
					field: 'sk',
					composite: ['phase', 'turn'],
				},
			},
		},
	},
	config
);

export const Player = new Entity(
	{
		model: {
			entity: 'Player',
			service: 'FridgeMagnets',
			version: '1',
		},
		attributes: {
			connectionId: {
				type: 'string',
				required: true,
			},
			name: {
				type: 'string',
				required: true,
			},
			roomId: {
				type: 'string',
				required: true,
			},
			isVIP: {
				type: 'boolean',
				required: true,
				default: false,
			},
			status: {
				type: playerStatuses,
				required: true,
				default: 'editing',
			},
			isConnected: {
				type: 'boolean',
				required: true,
				default: true,
			},
		},
		indexes: {
			primary: {
				pk: {
					field: 'pk',
					composite: ['roomId'],
				},
				sk: {
					field: 'sk',
					composite: ['name', 'connectionId'],
				},
			},
		},
	},
	config
);

export const db = new Service({
	Player,
	Room,
	WSConnection,
});
