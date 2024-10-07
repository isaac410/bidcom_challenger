import { LinkTracker } from 'src/infraestructure/schemas/link-tracker.schema';
import { CreateLinkTrackerDto } from 'src/application/dtos/create-link-tracker.dto';

export default abstract class AbstractAppRepository {
  /**
   * @description Create a new LinkTracker document.
   * @param dto Contain the data of new LinkTracker.
   * @returns A promise that resolves to the new LinkTracker posted.
   */
  abstract create(dto: CreateLinkTrackerDto): Promise<LinkTracker>;

  /**
   * @description Get an LinkTracker document filter by some property.
   * @param key name of the property of LinkTracker to be filtered.
   * @param value value of the property to be filtered.
   * @returns A promise that resolves to the LinkTracker requested.
   */
  abstract findOneByKey(
    key: keyof LinkTracker,
    value: unknown,
  ): Promise<LinkTracker>;

  /**
   * @description Updates a LinkTracker identified by its ID.
   * This method updates the details of a LinkTracker using the provided ID and DTO.
   * @example const updatedLinkTracker = await this.updateOneById('trackerId', createLinkTrackerDto);
   * @param {string} id - The ID of the LinkTracker to update.
   * @param {CreateLinkTrackerDto} dto - The data transfer object containing the updated LinkTracker details.
   * @returns {Promise<LinkTracker>} The updated LinkTracker object.
   */
  abstract updateOneById(
    id: string,
    dto: CreateLinkTrackerDto,
  ): Promise<LinkTracker>;

  /**
   * @description Retrieves all LinkTrackers.
   * This method returns an array of LinkTracker objects.
   * @example const allLinkTrackers = await this.findAll();
   * @returns {Promise<LinkTracker[]>} An array of LinkTracker objects.
   */
  abstract findAll(): Promise<LinkTracker[]>;
}
